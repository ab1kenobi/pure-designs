import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminProductForm } from "@/components/admin-product-form";
import { SignOutButton } from "@/components/signout-button";
import { MarkShippedButton } from "@/components/order-actions";
import { BESPOKE_TYPE_LABELS } from "@/lib/email";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect("/");

  const admin = createAdminClient();
  const [{ data: orders }, { data: bespoke }, { data: products }] = await Promise.all([
    admin
      .from("orders")
      .select("id, customer_email, customer_phone, total, status, shipping_address, created_at, order_items(quantity, unit_price, products(name))")
      .order("created_at", { ascending: false })
      .limit(25),
    admin.from("bespoke_requests").select("*").order("created_at", { ascending: false }).limit(25),
    admin.from("products").select("*").order("created_at", { ascending: false })
  ]);

  return (
    <main className="container-pd py-16 md:py-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Admin</p>
          <h1 className="display text-5xl mt-3">Pure Designs dashboard</h1>
        </div>
        <SignOutButton />
      </div>
      <div className="thread-rule-thin mt-6" />

      <section className="mt-12">
        <h2 className="display text-3xl">Add a scarf</h2>
        <AdminProductForm />
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl">Products</h2>
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products?.map((p: any) => (
            <div key={p.id} className="site-panel p-5">
              <div className="flex justify-between gap-3">
                <strong>{p.name}</strong><span>${Number(p.price).toFixed(2)}</span>
              </div>
              <p className="text-sm text-[var(--muted)] mt-2">{p.inventory} in stock</p>
              <p className={`text-xs mt-3 font-semibold uppercase tracking-[0.1em] ${p.is_active ? "text-[var(--teal)]" : "text-[var(--muted)]"}`}>{p.is_active ? "Active" : "Hidden"}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl">Recent orders</h2>
        <div className="mt-5 space-y-4">
          {orders?.length ? orders.map((o: any) => {
            const address = o.shipping_address;
            return (
              <div key={o.id} className="site-panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{o.customer_email || "No email on file"}</p>
                    {o.customer_phone && <p className="text-sm text-[var(--muted)]">{o.customer_phone}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(o.total).toFixed(2)}</p>
                    <p className={`text-xs mt-1 font-semibold uppercase tracking-[0.1em] ${o.status === "shipped" ? "text-[var(--teal)]" : "text-[var(--saffron)]"}`}>{o.status}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="label">Ship to</p>
                    {address ? (
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {address.name && <>{address.name}<br /></>}
                        {address.line1}{address.line1 && <br />}
                        {address.line2 && <>{address.line2}<br /></>}
                        {[address.city, address.state, address.postal_code].filter(Boolean).join(", ")}
                        {address.country && <><br />{address.country}</>}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-[var(--muted)]">No shipping address on file.</p>
                    )}
                  </div>
                  <div>
                    <p className="label">Items</p>
                    <div className="mt-2 text-sm text-[var(--muted)] space-y-1">
                      {o.order_items?.map((item: any, i: number) => (
                        <div key={i}>{item.quantity} × {item.products?.name}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <p className="text-xs text-[var(--muted)]">{new Date(o.created_at).toLocaleString()}</p>
                  {o.status === "paid" && <MarkShippedButton orderId={o.id} />}
                </div>
              </div>
            );
          }) : <p className="mt-5 text-[var(--muted)]">No orders yet.</p>}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl">Bespoke requests</h2>
        <div className="mt-5 space-y-4">
          {bespoke?.length ? bespoke.map((b: any) => {
            const address = b.shipping_address;
            const typeLabel = BESPOKE_TYPE_LABELS[b.type] || b.type;
            return (
              <div key={b.id} className="site-panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <strong>{b.name}</strong>
                    <p className="text-sm text-[var(--muted)] mt-1">{b.email} · {b.phone || "No phone"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{typeLabel} · ${Number(b.price || 0).toFixed(2)}</p>
                    <p className={`text-xs mt-1 font-semibold uppercase tracking-[0.1em] ${b.status === "paid" ? "text-[var(--teal)]" : "text-[var(--saffron)]"}`}>{b.status}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[var(--muted)]">Colors: {b.colors || "Not specified"} · Occasion: {b.occasion || "Not specified"}</p>
                <p className="mt-3">{b.description}</p>
                {b.inspiration_url && (
                  <a href={b.inspiration_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm underline decoration-[var(--saffron)] underline-offset-4">
                    Inspiration link
                  </a>
                )}

                <div className="mt-4">
                  <p className="label">Ship to</p>
                  {address ? (
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {address.name && <>{address.name}<br /></>}
                      {address.line1}{address.line1 && <br />}
                      {address.line2 && <>{address.line2}<br /></>}
                      {[address.city, address.state, address.postal_code].filter(Boolean).join(", ")}
                      {address.country && <><br />{address.country}</>}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--muted)]">Not yet paid, or no shipping address on file.</p>
                  )}
                </div>

                <p className="mt-4 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]">{new Date(b.created_at).toLocaleString()}</p>
              </div>
            );
          }) : <p className="mt-5 text-[var(--muted)]">No bespoke requests yet.</p>}
        </div>
      </section>
    </main>
  );
}
