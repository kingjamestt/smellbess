-- Smell Bess: initial schema.
--
-- Security model: RLS is on for every table and there are NO policies, so the
-- publishable (anon) key can't read or write anything. Only the site's server
-- talks to the database, with the secret key (service_role), and it checks the
-- admin session itself. Supabase Auth is used only to log the 2 admins in.
--
-- Shapes mirror web/src/lib/types.ts. Catalog rows keep the TS object in a
-- jsonb `data` column so copy can change without migrations.

create table public.products (
  id text primary key,
  sort int not null default 0,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.sets (
  id text primary key,
  sort int not null default 0,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.bottles (
  id text primary key,
  product_id text not null references public.products (id),
  size_ml int not null check (size_ml > 0),
  ml_remaining numeric(6, 1) not null check (ml_remaining >= 0),
  cost_ttd numeric(10, 2) not null default 0,
  source text not null default '',
  is_tester boolean not null default false,
  opened_at date,
  updated_at timestamptz not null default now()
);
create index bottles_product_id_idx on public.bottles (product_id);

create table public.areas (
  id text primary key,
  name text not null,
  zone text not null check (zone in ('urban', 'rural', 'extended', 'remote', 'tobago')),
  sort int not null default 0
);

-- One row. Atomizer flags, low-stock threshold and the Saturday pickup run.
create table public.settings (
  id int primary key default 1 check (id = 1),
  atomizers jsonb not null,
  low_stock_threshold int not null check (low_stock_threshold >= 0),
  pickup_day text not null,
  pickup_points jsonb not null,
  updated_at timestamptz not null default now()
);

create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'paid', 'decanted', 'ready', 'out_for_delivery', 'done', 'cancelled')),
  customer jsonb not null,
  lines jsonb not null,
  offer jsonb,
  delivery jsonb not null,
  payment text not null check (payment in ('bank_transfer', 'cash_on_pickup')),
  totals jsonb not null,
  utm jsonb,
  -- 'web' = checkout, 'admin' = entered by an admin (WhatsApp or workplace).
  source text not null default 'web' check (source in ('web', 'admin')),
  -- ml per product this order holds while it's new or paid ({"khamrah": 20}).
  reserved jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create index orders_status_created_idx on public.orders (status, created_at desc);

alter table public.products enable row level security;
alter table public.sets enable row level security;
alter table public.bottles enable row level security;
alter table public.areas enable row level security;
alter table public.settings enable row level security;
alter table public.orders enable row level security;

revoke all on public.products, public.sets, public.bottles, public.areas, public.settings, public.orders
  from anon, authenticated;
revoke all on sequence public.order_number_seq from anon, authenticated;

-- Save an order only if there's still juice for it. Runs under one advisory
-- lock so two customers can't both claim the last 10ml.
-- p_demand: ml per product this order needs ({"khamrah": 20}).
create or replace function public.place_order(p_order jsonb, p_demand jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_short jsonb := '[]'::jsonb;
  v_row record;
  v_order public.orders;
begin
  perform pg_advisory_xact_lock(hashtext('smellbess.place_order'));

  for v_row in
    select
      d.key as product_id,
      d.value::numeric as need,
      greatest(
        coalesce((select sum(b.ml_remaining) from public.bottles b where b.product_id = d.key), 0)
        - coalesce((
            select sum((o.reserved ->> d.key)::numeric)
            from public.orders o
            where o.status in ('new', 'paid') and o.reserved ? d.key
          ), 0),
        0
      ) as available
    from jsonb_each_text(p_demand) d
  loop
    if v_row.need > v_row.available then
      v_short := v_short || jsonb_build_object(
        'productId', v_row.product_id,
        'neededMl', v_row.need,
        'availableMl', v_row.available
      );
    end if;
  end loop;

  if jsonb_array_length(v_short) > 0 then
    return jsonb_build_object('ok', false, 'shortfalls', v_short);
  end if;

  insert into public.orders (number, customer, lines, offer, delivery, payment, totals, utm, source, reserved)
  values (
    'SB-' || nextval('public.order_number_seq'),
    p_order -> 'customer',
    p_order -> 'lines',
    nullif(p_order -> 'offer', 'null'::jsonb),
    p_order -> 'delivery',
    p_order ->> 'payment',
    p_order -> 'totals',
    nullif(p_order -> 'utm', 'null'::jsonb),
    coalesce(p_order ->> 'source', 'web'),
    p_demand
  )
  returning * into v_order;

  return jsonb_build_object('ok', true, 'id', v_order.id);
end;
$$;

-- Move an order to its next status, only if nobody moved it first. When it's
-- decanted, take the juice out of the bottles in the same transaction.
-- p_deductions: [{"bottleId": "KH-01", "ml": 20}]
create or replace function public.transition_order(
  p_id uuid,
  p_from text,
  p_to text,
  p_deductions jsonb default '[]'::jsonb
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count int;
  v_d jsonb;
begin
  update public.orders
  set status = p_to, updated_at = now()
  where id = p_id and status = p_from;
  get diagnostics v_count = row_count;
  if v_count = 0 then
    return false;
  end if;

  for v_d in select * from jsonb_array_elements(p_deductions)
  loop
    update public.bottles
    set ml_remaining = greatest(0, ml_remaining - (v_d ->> 'ml')::numeric), updated_at = now()
    where id = v_d ->> 'bottleId';
  end loop;
  return true;
end;
$$;

revoke execute on function public.place_order(jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.transition_order(uuid, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.place_order(jsonb, jsonb) to service_role;
grant execute on function public.transition_order(uuid, text, text, jsonb) to service_role;
