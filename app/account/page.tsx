import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/signout-button";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, status, created_at, order_items(quantity, unit_price, products(name))")
    .eq("customer_email", user.email!)
    .order("created_at", { ascending: false });

  return (
    <main className="container-pd py-16 md:py-24">
      <div className="flex justify-between items-end gap-4">
        <div>
          <p className="label">Account</p>
          <h1 className="display text-5xl mt-3">Welcome back.</h1>
          <p className="text-[var(--muted)] mt-3">{user.email}</p>
        </div>
        <SignOutButton />
      </div>
      <div className="thread-rule-thin mt-6" />

      <section className="mt-14">
        <h2 className="display text-3xl">Order history</h2>
        <div className="mt-7 space-y-4">
          {orders?.length ? orders.map((order: any) => (
            <div key={order.id} className="site-panel p-5">
              <div className="flex justify-between">
                <span className="text-sm">Order {order.id.slice(0, 8)}</span>
                <span className="text-sm font-semibold uppercase text-[var(--teal)]">{order.status}</span>
              </div>
              <div className="mt-4 text-sm text-[var(--muted)]">
                {order.order_items?.map((item: any, i: number) => (
                  <div key={i}>{item.quantity} × {item.products?.name}</div>
                ))}
              </div>
              <p className="mt-4 font-semibold">${Number(order.total).toFixed(2)}</p>
            </div>
          )) : <p className="text-[var(--muted)]">No orders yet. <Link className="underline decoration-[var(--saffron)] underline-offset-4" href="/shop">Shop the collection.</Link></p>}
        </div>
      </section>
    </main>
  );
}
