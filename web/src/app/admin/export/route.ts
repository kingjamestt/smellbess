import { getAdmin } from "@/lib/auth";
import { ordersCsv } from "@/lib/csv";
import { getRepository } from "@/lib/data";

/** All orders as CSV. Admin only. */
export async function GET() {
  if (!(await getAdmin())) return new Response("Not found", { status: 404 });
  const csv = ordersCsv(await getRepository().listOrders());
  const date = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smellbess-orders-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
