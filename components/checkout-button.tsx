"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function CheckoutButton() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((x) => ({ id: x.id, quantity: x.quantity })) })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to start checkout.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <>
      <button onClick={checkout} disabled={loading || !items.length} className="btn btn-dark w-full mt-7">
        {loading ? "Opening checkout..." : "Checkout"}
      </button>
      {error && <p className="text-sm text-[var(--berry)] mt-3">{error}</p>}
    </>
  );
}
