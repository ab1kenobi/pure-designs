"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BESPOKE_TYPES, BESPOKE_DRAFT_KEY, type BespokeDraft } from "@/lib/bespoke";

export default function BespokeCheckoutPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<BespokeDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem(BESPOKE_DRAFT_KEY);
    const parsed = raw ? (JSON.parse(raw) as BespokeDraft) : null;
    const option = parsed ? BESPOKE_TYPES.find((t) => t.value === parsed.type) : null;

    if (!parsed || !option) {
      router.replace("/bespoke");
      return;
    }

    setDraft(parsed);
  }, [router]);

  if (!draft) return null;

  const option = BESPOKE_TYPES.find((t) => t.value === draft.type)!;

  async function confirm() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/bespoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });

    const data = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(data.error || "Unable to start checkout.");
      return;
    }

    sessionStorage.removeItem(BESPOKE_DRAFT_KEY);
    window.location.href = data.url;
  }

  return (
    <main className="container-pd py-16 md:py-24 max-w-2xl">
      <p className="label">Review your order</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Bespoke checkout</h1>
      <div className="thread-rule-thin mt-6" />

      <div className="site-panel mt-10 p-7">
        <div className="flex items-center justify-between">
          <span className="display text-2xl">{option.label}</span>
          <span className="text-xl font-semibold">${option.price.toFixed(2)}</span>
        </div>

        <div className="mt-6 space-y-3 border-t border-[var(--line)] pt-6 text-sm">
          <div className="flex justify-between gap-4"><span className="text-[var(--muted)]">Name</span><span>{draft.name}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[var(--muted)]">Email</span><span>{draft.email}</span></div>
          {draft.phone && <div className="flex justify-between gap-4"><span className="text-[var(--muted)]">Phone</span><span>{draft.phone}</span></div>}
          {draft.colors && <div className="flex justify-between gap-4"><span className="text-[var(--muted)]">Colors</span><span>{draft.colors}</span></div>}
          {draft.occasion && <div className="flex justify-between gap-4"><span className="text-[var(--muted)]">Occasion</span><span>{draft.occasion}</span></div>}
          {draft.inspiration_url && (
            <div className="flex justify-between gap-4">
              <span className="text-[var(--muted)]">Inspiration</span>
              <a href={draft.inspiration_url} target="_blank" rel="noreferrer" className="underline decoration-[var(--saffron)] underline-offset-4">Link</a>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-[var(--line)] pt-6">
          <p className="text-sm text-[var(--muted)]">Description</p>
          <p className="mt-2 text-sm leading-6">{draft.description}</p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-6 text-base">
          <strong>Total</strong>
          <strong>${option.price.toFixed(2)}</strong>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href="/bespoke" className="btn btn-light">Edit details</Link>
        <button onClick={confirm} disabled={loading} className="btn btn-dark flex-1">
          {loading ? "Opening checkout..." : "Continue to payment"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-[var(--berry)]">{error}</p>}
    </main>
  );
}
