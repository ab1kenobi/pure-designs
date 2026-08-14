import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="site-panel p-10 text-center text-[var(--muted)]">
        <p className="display text-2xl text-[var(--ink)]">The collection is being prepared.</p>
        <p className="mt-2 text-sm">Check back soon, or start a bespoke request in the meantime.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <Link href={`/shop/${product.slug}`} key={product.id} className="group block">
          <div className="scarf-card">
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className="card-image transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="label">{product.category}</p>
              <h3 className="display mt-1.5 text-2xl leading-none text-[var(--ink)]">{product.name}</h3>
            </div>
            <p className="pt-1 text-sm font-semibold">${Number(product.price).toFixed(0)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
