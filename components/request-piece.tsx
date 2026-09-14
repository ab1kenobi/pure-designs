"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

export function RequestPiece({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/request-piece", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        message: String(form.get("message") || "")
      })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Unable to send your request.");
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  if (product.inventory <= 0) {
    return <button disabled className="btn btn-dark w-full mt-8 opacity-40">Sold out</button>;
  }

  if (status === "sent") {
    return (
      <div className="mt-8 site-panel p-5 text-center">
        <p className="text-sm">Your request has been sent. Batul will follow up by email to arrange payment and shipping.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-dark w-full mt-8">
        Request this piece
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 site-panel p-5 space-y-3">
      <p className="text-sm text-[var(--muted)]">
        Tell Batul a bit about yourself and she'll follow up by email to arrange payment and shipping.
      </p>
      <input required name="name" placeholder="Your name" className="input" />
      <input required name="email" type="email" placeholder="Your email" className="input" />
      <input name="phone" placeholder="Phone (optional)" className="input" />
      <textarea name="message" placeholder="Message (optional)" rows={3} className="input" />
      <button type="submit" disabled={status === "loading"} className="btn btn-dark w-full disabled:opacity-40">
        {status === "loading" ? "Sending..." : "Send request"}
      </button>
      {error && <p className="text-sm text-[var(--berry)]">{error}</p>}
    </form>
  );
}
