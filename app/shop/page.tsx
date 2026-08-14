import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/products";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="container-pd py-14 md:py-20">
      <div className="mb-10 max-w-3xl">
        <p className="label">Shop</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">The collection</h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)] md:text-lg">
          Hand-dyed silk scarves in small, considered dye lots — cut, hemmed, and pressed one at a time.
        </p>
        <div className="thread-rule-thin mt-6" />
      </div>

      <div className="mb-10 grid gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] sm:grid-cols-3">
        <div className="site-panel px-4 py-3">Silk scarves</div>
        <div className="site-panel px-4 py-3">Textured staples</div>
        <div className="site-panel px-4 py-3">Bespoke commissions</div>
      </div>

      <ProductGrid products={products} />
    </main>
  );
}
