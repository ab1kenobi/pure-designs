import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminProductForm } from "@/components/admin-product-form";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect("/");

  const admin = createAdminClient();
  const [{ data: orders }, { data: bespoke }, { data: products }] = await Promise.all([
    admin.from("orders").select("id, customer_email, total, status, created_at").order("created_at", { ascending: false }).limit(25),
    admin.from("bespoke_requests").select("*").order("created_at", { ascending: false }).limit(25),
    admin.from("products").select("*").order("created_at", { ascending: false })
  ]);

  return (
    <main className="container-pd py-16 md:py-24">
      <p className="label">Admin</p>
      <h1 className="display text-5xl mt-3">Pure Designs dashboard</h1>
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
        <div className="mt-5 border-t border-[var(--line)]">
          {orders?.map((o: any) => (
            <div key={o.id} className="py-4 border-b border-[var(--line)] flex justify-between gap-5 text-sm">
              <span>{o.customer_email}</span>
              <span>${Number(o.total).toFixed(2)}</span>
              <span className="font-semibold uppercase text-[var(--teal)]">{o.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl">Bespoke requests</h2>
        <div className="mt-5 space-y-4">
          {bespoke?.map((b: any) => (
            <div key={b.id} className="site-panel p-5">
              <div className="flex justify-between">
                <strong>{b.name}</strong><span className="text-sm font-semibold uppercase text-[var(--muted)]">{b.status}</span>
              </div>
              <p className="text-sm text-[var(--muted)] mt-2">{b.email} · {b.phone || "No phone"}</p>
              <p className="mt-4">{b.description}</p>
              <p className="text-sm text-[var(--muted)] mt-3">Budget: {b.budget || "Not specified"} · Colors: {b.colors || "Not specified"}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
