-- Sealed bottles (business-plan.md §1, 5 Oct 2026): each launch scent has one
-- bottle kept sealed and sold whole. Its ml never count as decant stock.
--
-- Reservations: orders.reserved now also holds sealed-bottle counts under
-- "bottle:<productId>" keys, next to the ml-per-product keys. The product's
-- sealed price lives in products.data.bottle (jsonb, no column needed).

alter table public.bottles
  add column sealed boolean not null default false,
  add column sold_at timestamptz;

-- Same lock and same rule as before, plus: a "bottle:<id>" key is checked
-- against sealed, unsold bottles of that product (a count), and sealed
-- bottles are left out of the ml sums.
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
      d.key,
      d.value::numeric as need,
      greatest(
        case
          when d.key like 'bottle:%' then
            coalesce((
              select count(*) from public.bottles b
              where b.product_id = substr(d.key, 8) and b.sealed and b.sold_at is null
            ), 0)
          else
            coalesce((
              select sum(b.ml_remaining) from public.bottles b
              where b.product_id = d.key and not b.sealed
            ), 0)
        end
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
        'productId', v_row.key,
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

-- As before, plus: a deduction with "sell": true marks a sealed bottle sold.
-- p_deductions: [{"bottleId": "KH-01", "ml": 20}, {"bottleId": "HI-S1", "ml": 0, "sell": true}]
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
    if coalesce((v_d ->> 'sell')::boolean, false) then
      update public.bottles
      set sold_at = now(), updated_at = now()
      where id = v_d ->> 'bottleId' and sealed and sold_at is null;
    else
      update public.bottles
      set ml_remaining = greatest(0, ml_remaining - (v_d ->> 'ml')::numeric), updated_at = now()
      where id = v_d ->> 'bottleId';
    end if;
  end loop;
  return true;
end;
$$;

revoke execute on function public.place_order(jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.transition_order(uuid, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.place_order(jsonb, jsonb) to service_role;
grant execute on function public.transition_order(uuid, text, text, jsonb) to service_role;
