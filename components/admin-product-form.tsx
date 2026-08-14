"use client";

import { useState } from "react";
import { slugify } from "@/lib/utils";

export function AdminProductForm() {
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const payload = {
      name,
      slug: slugify(name),
      description: String(form.get("description") || ""),
      price: Number(form.get("price")),
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
      <input required name="name" placeholder="Scarf name" className="input" />
      <input required name="price" type="number" step="0.01" min="1" placeholder="Price" className="input" />
      <input name="material" placeholder="Material" className="input" />
      <input name="dimensions" placeholder="Dimensions" className="input" />
      <input name="category" placeholder="Category" defaultValue="Scarves" className="input" />
      <input required name="inventory" type="number" min="0" placeholder="Inventory" className="input" />
      <textarea required name="description" placeholder="Description" className="input md:col-span-2" rows={4} />
      <textarea required name="images" placeholder="Image URLs, one per line" className="input md:col-span-2" rows={4} />
      <label className="text-sm flex gap-2 items-center"><input type="checkbox" name="is_featured" /> Featured on homepage</label>
      <div><button className="btn btn-dark">Create product</button></div>
      {message && <p className="text-sm md:col-span-2">{message}</p>}
    </form>
  );
}
