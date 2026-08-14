"use client";

import { useState } from "react";

export function BespokeForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const response = await fetch("/api/bespoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus(data.error || "Something went wrong.");
      return;
    }

    event.currentTarget.reset();
    setStatus("Thank you. Batul will be in touch soon.");
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <label className="text-sm">Name<input required name="name" className="input mt-2" /></label>
        <label className="text-sm">Email<input required type="email" name="email" className="input mt-2" /></label>
        <label className="text-sm">Phone<input name="phone" className="input mt-2" /></label>
        <label className="text-sm">Budget<input name="budget" placeholder="$100–$250" className="input mt-2" /></label>
        <label className="text-sm md:col-span-2">Preferred colors<input name="colors" className="input mt-2" placeholder="e.g. ivory, deep blue, gold" /></label>
        <label className="text-sm md:col-span-2">Occasion<input name="occasion" className="input mt-2" placeholder="Gift, wedding, celebration, everyday..." /></label>
      </div>
      <label className="text-sm block">Tell us what you are imagining<textarea required name="description" rows={6} className="input mt-2" placeholder="Describe the design, mood, size, inspiration, or anything else that matters." /></label>
      <label className="text-sm block">Inspiration link (optional)<input name="inspiration_url" className="input mt-2" placeholder="https://..." /></label>
      <button disabled={loading} className="btn btn-dark">{loading ? "Sending..." : "Submit bespoke request"}</button>
      {status && <p className="text-sm text-[var(--teal)]">{status}</p>}
    </form>
  );
}
