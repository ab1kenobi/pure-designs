import { BespokeForm } from "@/components/bespoke-form";

export default function BespokePage() {
  return (
    <main className="container-pd py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="max-w-xl">
          <p className="label">Bespoke</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Create something made just for you.</h1>
          <p className="mt-6 text-base leading-8 text-[var(--muted)] md:text-lg">
            Choose your piece, share your colors, occasion, and inspiration, and pay securely upfront — Batul will follow up with a dye plan and start bringing it to life.
          </p>

          <div className="mt-8 border-t border-[var(--line)] pt-6">
            <p className="label">Bespoke pricing</p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li className="flex justify-between gap-3"><span>Bespoke scarf</span><span className="font-semibold text-[var(--ink)]">$150</span></li>
              <li className="flex justify-between gap-3"><span>Bespoke purse</span><span className="font-semibold text-[var(--ink)]">$75</span></li>
              <li className="flex justify-between gap-3"><span>Bespoke scarf + purse set</span><span className="font-semibold text-[var(--ink)]">$175</span></li>
            </ul>
          </div>

          <div className="mt-8 border-t border-[var(--line)] pt-6">
            <p className="label">Typical project</p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li className="flex gap-3"><span className="text-[var(--saffron)]">—</span> Gift scarves for weddings and milestones</li>
              <li className="flex gap-3"><span className="text-[var(--teal)]">—</span> Accent palettes matched to interiors or wardrobes</li>
              <li className="flex gap-3"><span className="text-[var(--berry)]">—</span> One-off commissions in a personal visual language</li>
            </ul>
          </div>
        </div>

        <div className="scarf-card p-4 sm:p-6 md:p-8">
          <BespokeForm />
        </div>
      </div>
    </main>
  );
}
