"use client";

import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)]">
      <div className="container-pd flex h-20 items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
          <span className="display text-xl sm:text-[1.7rem]">Pure Designs</span>
          <span className="hidden text-[9px] uppercase tracking-[0.22em] text-[var(--muted)] sm:inline-block">by Batul</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)] md:flex">
          <Link href="/shop" className="transition-colors hover:text-[var(--teal)]">Shop</Link>
          <Link href="/bespoke" className="transition-colors hover:text-[var(--teal)]">Bespoke</Link>
          <Link href="/about" className="transition-colors hover:text-[var(--teal)]">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" aria-label="Account" className="inline-flex h-10 w-10 items-center justify-center border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]">
            <UserRound size={17} strokeWidth={1.5} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative inline-flex h-10 w-10 items-center justify-center border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]">
            <ShoppingBag size={17} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 min-w-4.5 items-center justify-center rounded-full bg-[var(--berry)] px-1 text-[9px] font-bold text-[var(--paper)]">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="thread-rule" />

      <div className="md:hidden border-b border-[var(--line)]">
        <nav className="container-pd flex h-11 items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">
          <Link href="/shop">Shop</Link>
          <Link href="/bespoke">Bespoke</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
