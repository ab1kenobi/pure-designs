"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditProductPrice({ productId, price }: { productId: string; price: number }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(price));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: Number(value) })
    });
    setSaving(false);
    if (response.ok) {
      setEditing(false);
      router.refresh();
    }
  }

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} className="text-sm font-semibold hover:text-[var(--teal)]">
        ${price.toFixed(2)}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min="0.01"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input w-20 !py-1.5 !px-2 text-sm"
      />
      <button onClick={save} disabled={saving} className="text-xs font-semibold uppercase text-[var(--teal)] disabled:opacity-40">
        {saving ? "..." : "Save"}
      </button>
    </div>
  );
}
