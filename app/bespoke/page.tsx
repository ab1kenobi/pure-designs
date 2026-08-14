import { BespokeForm } from "@/components/bespoke-form";

export default function BespokePage() {
  return (
    <main className="container-pd py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="max-w-xl">
          <p className="label">Bespoke</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Create something made just for you.</h1>
          <p className="mt-6 text-base leading-8 text-[var(--muted)] md:text-lg">
            Tell Batul what you're imagining. Share your colors, occasion, inspiration, and anything else that matters — she'll follow up with a dye plan and a quote.
          </p>

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
