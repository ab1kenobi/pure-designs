"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarkShippedButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markShipped() {
    setLoading(true);
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "shipped" })
    });
    setLoading(false);
    if (response.ok) router.refresh();
  }

  return (
    <button onClick={markShipped} disabled={loading} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--teal)] hover:opacity-70 disabled:opacity-40">
      {loading ? "Marking..." : "Mark as shipped"}
    </button>
  );
}
