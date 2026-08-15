"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { BESPOKE_TYPES, BESPOKE_DRAFT_KEY, type BespokeType, type BespokeDraft } from "@/lib/bespoke";

export function BespokeForm() {
  const router = useRouter();
  const [type, setType] = useState<BespokeType>("scarf");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const draft: BespokeDraft = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      type,
      colors: String(form.get("colors") || ""),
      occasion: String(form.get("occasion") || ""),
      description: String(form.get("description") || ""),
      inspiration_url: String(form.get("inspiration_url") || "")
    };

    sessionStorage.setItem(BESPOKE_DRAFT_KEY, JSON.stringify(draft));
    router.push("/bespoke/checkout");
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <p className="label mb-3">Choose your piece</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {BESPOKE_TYPES.map((option) => {
            const selected = type === option.value;
            return (
              <label
                key={option.value}
                className={`relative cursor-pointer p-4 pr-8 text-sm transition-colors ${
                  selected
                    ? "bg-[var(--ink)] border border-[var(--ink)] text-[var(--paper)]"
                    : "site-panel hover:border-[var(--ink)]"
                }`}
              >
                <input
                  type="radio"
                  name="bespoke_type"
                  value={option.value}
                  checked={selected}
                  onChange={() => setType(option.value)}
                  className="sr-only"
                />
                {selected && (
                  <span className="absolute top-3 right-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--paper)] text-[var(--ink)]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}
                <span className="block font-semibold">{option.label}</span>
                <span className={`mt-1 block ${selected ? "text-[var(--paper)]/75" : "text-[var(--muted)]"}`}>${option.price}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <label className="text-sm">Name<input required name="name" className="input mt-2" /></label>
        <label className="text-sm">Email<input required type="email" name="email" className="input mt-2" /></label>
        <label className="text-sm">Phone<input name="phone" className="input mt-2" /></label>
        <label className="text-sm">Preferred colors<input name="colors" className="input mt-2" placeholder="e.g. ivory, deep blue, gold" /></label>
        <label className="text-sm md:col-span-2">Occasion<input name="occasion" className="input mt-2" placeholder="Gift, wedding, celebration, everyday..." /></label>
      </div>
      <label className="text-sm block">Tell us what you are imagining<textarea required name="description" rows={6} className="input mt-2" placeholder="Describe the design, mood, size, inspiration, or anything else that matters." /></label>
      <label className="text-sm block">Inspiration link (optional)<input name="inspiration_url" className="input mt-2" placeholder="https://..." /></label>
      <button className="btn btn-dark">Review order</button>
    </form>
  );
}
