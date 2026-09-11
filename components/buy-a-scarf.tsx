"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

const SHOWCASE_IMAGES = [
  "/images/showcase/scarf-1.jpg",
  "/images/showcase/scarf-2.jpg",
  "/images/showcase/scarf-3.jpg",
  "/images/showcase/scarf-4.jpg",
  "/images/showcase/scarf-5.jpg",
  "/images/showcase/scarf-6.jpg",
];

export function BuyAScarf({ products }: { products: Product[] }) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const totalAvailable = useMemo(
    () => products.reduce((sum, p) => sum + p.inventory, 0),
    [products]
  );

  const inStock = totalAvailable > 0;
  const price = products[0]?.price ?? 100;
  const qtyOptions = Math.max(Math.min(totalAvailable, 10), 1);

  function handleAdd() {
    let remaining = quantity;
    for (const product of products) {
      if (remaining <= 0) break;
      const inCart = items.find((i) => i.id === product.id)?.quantity ?? 0;
      const canAdd = Math.min(remaining, product.inventory - inCart);
      for (let i = 0; i < canAdd; i++) addItem(product);
      remaining -= canAdd;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div>
        <div className="grid grid-cols-2 gap-3">
          {SHOWCASE_IMAGES.map((src, i) => (
            <div key={src} className={i === 0 ? "col-span-2 scarf-card" : "scarf-card"}>
              <img
                src={src}
                alt={`Finished silk scarf from the studio, example ${i + 1}`}
                className={i === 0 ? "aspect-[4/5] w-full object-cover" : "aspect-square w-full object-cover"}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
          A showcase of finished pieces from the studio — not a catalog of the exact designs currently in stock.
        </p>
      </div>

      <div className="md:sticky md:top-24 self-start">
        <p className="label">Scarves</p>
        <h1 className="display mt-3 text-5xl md:text-6xl">Silk Scarf</h1>
        <p className="mt-5 text-2xl font-semibold">${Number(price).toFixed(2)}</p>
        <div className="thread-rule-thin mt-5" />

        <div className="mt-7 border-y border-[var(--line)] py-7 text-[var(--muted)] leading-7">
          <p>
            Hand-dyed silk twill, cut, hemmed, and pressed one at a time in small dye lots.
            Every scarf is one of a kind — no two pieces come out exactly alike, so the scarf
            you receive will be its own unique design, and may not match the photos above.
          </p>
          <dl className="mt-7 grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <dt className="font-semibold text-[var(--ink)]">Material</dt>
              <dd>Silk</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--ink)]">Dimensions</dt>
              <dd>Approx. 36 × 36 in</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--ink)]">Availability</dt>
              <dd className={inStock ? "text-[var(--teal)] font-semibold" : "text-[var(--muted)] font-semibold"}>
                {inStock ? `${totalAvailable} in stock` : "Sold out"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="site-panel mt-8 p-5">
          <div className="flex items-center gap-3">
            <label htmlFor="qty" className="label">Qty</label>
            <select
              id="qty"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input w-20"
              disabled={!inStock}
            >
              {Array.from({ length: qtyOptions }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <button
            disabled={!inStock}
            onClick={handleAdd}
            className="btn btn-dark w-full mt-4 disabled:opacity-40 disabled:hover:bg-[var(--ink)] disabled:hover:translate-y-0"
          >
            {!inStock ? "Sold out" : added ? "Added to cart" : "Add to cart"}
          </button>

          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
            Each scarf is a unique, hand-dyed design — we'll confirm exactly which piece is
            yours once your order is packed.
          </p>
        </div>

        <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
          Secure checkout powered by Stripe. No account needed.
        </p>
      </div>
    </div>
  );
}
