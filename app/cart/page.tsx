"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { CheckoutButton } from "@/components/checkout-button";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart();

  return (
    <main className="container-pd py-16 md:py-24">
      <p className="label">Your selection</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Cart</h1>
      <div className="thread-rule-thin mt-5" />

      {items.length === 0 ? (
        <div className="site-panel mt-12 py-20 text-center">
          <p className="text-[var(--muted)]">Your cart is empty.</p>
          <Link href="/shop" className="btn btn-dark mt-7 inline-flex">Browse scarves</Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-t border-[var(--line)] pt-5 sm:gap-5">
                <div className="scarf-card h-32 w-24 flex-shrink-0 sm:h-40 sm:w-28">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="display text-2xl">{item.name}</h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">${item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--berry)]">
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-9 w-9 border border-[var(--line)] bg-[var(--panel)] text-lg leading-none transition-colors hover:border-[var(--ink)]">
                      −
                    </button>
                    <span className="min-w-4 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-9 w-9 border border-[var(--line)] bg-[var(--panel)] text-lg leading-none transition-colors hover:border-[var(--ink)]">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="site-panel h-fit p-7">
            <p className="label">Order summary</p>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
              Shipping and tax can be configured in Stripe before production launch.
            </p>
            <CheckoutButton />
          </aside>
        </div>
      )}
    </main>
  );
}
