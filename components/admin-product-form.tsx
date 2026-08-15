"use client";

import { useState } from "react";
import { slugify } from "@/lib/utils";

const CATEGORY_PRICES: Record<string, number> = {
  Scarves: 100,
  Purses: 50
};

export function AdminProductForm() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Scarves");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const payload = {
      name,
      slug: slugify(name),
      description: String(form.get("description") || ""),
      material: String(form.get("material") || ""),
      dimensions: String(form.get("dimensions") || ""),
      category: String(form.get("category") || "Scarves"),
      inventory: Number(form.get("inventory")),
      images: String(form.get("images") || "").split("\n").map(x => x.trim()).filter(Boolean),
      is_featured: form.get("is_featured") === "on"
    };

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setMessage(response.ok ? "Product created. Refresh to see it." : (data.error || "Unable to create product."));
    if (response.ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} className="mt-5 site-panel p-6 grid md:grid-cols-2 gap-4">
      <input required name="name" placeholder="Product name" className="input" />
      <div className="flex items-center gap-3">
        <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="input">
          <option value="Scarves">Scarves</option>
          <option value="Purses">Purses</option>
        </select>
        <span className="text-sm text-[var(--muted)] whitespace-nowrap">${CATEGORY_PRICES[category].toFixed(2)} fixed</span>
      </div>
      <input name="material" placeholder="Material" className="input" />
      <input name="dimensions" placeholder="Dimensions" className="input" />
      <input required name="inventory" type="number" min="0" defaultValue={1} placeholder="Inventory" className="input" />
      <label className="text-sm flex gap-2 items-center"><input type="checkbox" name="is_featured" /> Featured on homepage</label>
      <textarea required name="description" placeholder="Description" className="input md:col-span-2" rows={4} />
      <textarea required name="images" placeholder="Image URLs, one per line" className="input md:col-span-2" rows={4} />
      <div><button className="btn btn-dark">Create product</button></div>
      {message && <p className="text-sm md:col-span-2">{message}</p>}
    </form>
  );
}
