"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type CartItem = Pick<Product, "id" | "name" | "price" | "inventory"> & {
  quantity: number;
  image: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("pdb-cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("pdb-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, x) => sum + x.quantity, 0),
    total: items.reduce((sum, x) => sum + x.quantity * Number(x.price), 0),
    addItem: (product: Product) => setItems((current) => {
      const existing = current.find((x) => x.id === product.id);
      if (existing) return current.map((x) => x.id === product.id ? { ...x, quantity: Math.min(x.quantity + 1, product.inventory) } : x);
      return [...current, { id: product.id, name: product.name, price: product.price, inventory: product.inventory, quantity: 1, image: product.images?.[0] || "" }];
    }),
    removeItem: (id: string) => setItems((current) => current.filter((x) => x.id !== id)),
    updateQuantity: (id: string, quantity: number) => setItems((current) =>
      current.map((x) => x.id === id ? { ...x, quantity: Math.max(0, Math.min(quantity, x.inventory)) } : x).filter((x) => x.quantity > 0)
    ),
    clear: () => setItems([])
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
