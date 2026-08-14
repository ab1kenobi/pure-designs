"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function add() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      disabled={product.inventory <= 0}
      onClick={add}
      className="btn btn-dark w-full mt-8 disabled:opacity-40 disabled:hover:bg-[var(--ink)] disabled:hover:translate-y-0"
    >
      {product.inventory <= 0 ? "Sold out" : added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
