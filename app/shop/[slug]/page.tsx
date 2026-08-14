import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { AddToCart } from "@/components/add-to-cart";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="container-pd py-12 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="grid grid-cols-2 gap-3">
          {(product.images?.length ? product.images : ["/placeholder.svg"]).map((src, i) => (
            <div key={src + i} className={i === 0 ? "col-span-2 scarf-card" : "scarf-card"}>
              <img
                src={src}
                alt={`${product.name} ${i + 1}`}
                className={i === 0 ? "aspect-[4/5] w-full object-cover" : "aspect-square w-full object-cover"}
              />
            </div>
          ))}
        </div>

        <div className="md:sticky md:top-24 self-start">
          <p className="label">{product.category}</p>
          <h1 className="display mt-3 text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-5 text-2xl font-semibold">${product.price.toFixed(2)}</p>
          <div className="thread-rule-thin mt-5" />

          <div className="mt-7 border-y border-[var(--line)] py-7 text-[var(--muted)] leading-7">
            <p>{product.description}</p>
            <dl className="mt-7 grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <dt className="font-semibold text-[var(--ink)]">Material</dt>
                <dd>{product.material || "Details available on request"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--ink)]">Dimensions</dt>
                <dd>{product.dimensions || "Details available on request"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--ink)]">Availability</dt>
                <dd>{product.inventory > 0 ? `${product.inventory} available` : "Sold out"}</dd>
              </div>
            </dl>
          </div>

          <div className="site-panel mt-8 p-5">
            <AddToCart product={product} />
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
            Secure checkout powered by Stripe. No account needed.
          </p>
        </div>
      </div>
    </main>
  );
}
