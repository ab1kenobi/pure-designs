import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <main className="pb-16 md:pb-24">
      <section className="relative overflow-hidden bg-[var(--paper)]">
        <div className="floral-watermark -right-16 -top-16 rotate-12" />
        <div className="container-pd grid gap-10 py-10 md:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <span className="pill"><span className="pill-dot" />Hand-dyed in small runs</span>
            <h1 className="display mt-6 max-w-[760px] text-6xl leading-[0.92] sm:text-7xl md:text-8xl">
              Silk that carries your color story.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-[var(--muted)] md:text-lg">
              Every scarf starts as a hand-mixed dye lot before it's cut, hemmed, and pressed one at a time. Nothing leaves the studio in more than a dozen pieces.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-dark">Shop the collection</Link>
              <Link href="/bespoke" className="btn btn-light">Start a bespoke piece</Link>
            </div>

            <div className="thread-rule mt-11 max-w-md" />
            <div className="mt-5 grid max-w-md grid-cols-3 gap-4 text-left">
              <div>
                <p className="label">Dye lots</p>
                <p className="display mt-1.5 text-2xl">≤ 12 pieces</p>
              </div>
              <div>
                <p className="label">Fabric</p>
                <p className="display mt-1.5 text-2xl">Silk twill</p>
              </div>
              <div>
                <p className="label">Hems</p>
                <p className="display mt-1.5 text-2xl">Hand-rolled</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 hidden rotate-2 bg-[var(--ink)] md:block" />
            <div className="scarf-card">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
                alt="Model wearing a silk scarf"
                className="h-[420px] w-full object-cover md:h-[600px]"
              />
            </div>
          </div>
        </div>
        <div className="fringe fringe-light" />
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="container-pd grid gap-3 py-6 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] sm:grid-cols-3">
          <div className="site-panel py-4">Hand-dyed silk twill</div>
          <div className="site-panel py-4">Thoughtful gifting</div>
          <div className="site-panel py-4">Custom commissions</div>
        </div>
      </section>

      <section className="container-pd py-20 md:py-28">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label">Selected pieces</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">The collection</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:text-[var(--teal)]">View all</Link>
        </div>

        <ProductGrid products={products} />
      </section>

      <section className="panel-dark">
        <div className="container-pd grid gap-10 py-20 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-24">
          <div className="scarf-card">
            <img
              src="https://images.unsplash.com/photo-1601924928374-cc4f3c2c8a5a?auto=format&fit=crop&w=1000&q=85"
              alt="Textile detail"
              className="h-[420px] w-full object-cover md:h-[540px]"
            />
          </div>

          <div>
            <p className="label text-[var(--paper)]/50">Creative direction</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">A scarf with your story in it.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--paper)]/70">
              Send over your palette, the occasion, and anything that's shaping your thinking — a photo, a place, a color you can't stop noticing. Batul will sketch a dye plan and follow up with a quote before anything is cut.
            </p>
            <Link href="/bespoke" className="btn mt-8 border-[var(--paper)] text-[var(--paper)] hover:bg-[var(--paper)] hover:text-[var(--ink)]">Start a bespoke request</Link>
          </div>
        </div>
      </section>

      <section className="container-pd py-20 md:py-24">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="site-panel p-7 md:p-8">
            <div className="thread-rule-thin" />
            <h3 className="display mt-5 text-3xl">Mixed by hand</h3>
            <p className="mt-4 text-[var(--muted)] leading-7">
              Every dye lot is mixed in the studio in small batches, so no two runs of the same design come out quite the same.
            </p>
          </div>

          <div className="site-panel p-7 md:p-8">
            <div className="thread-rule-thin" />
            <h3 className="display mt-5 text-3xl">Cut to last</h3>
            <p className="mt-4 text-[var(--muted)] leading-7">
              Hems are rolled and stitched by hand — the same finishing you'd find on a piece meant to be worn for years, not one season.
            </p>
          </div>

          <div className="site-panel p-7 md:p-8">
            <div className="thread-rule-thin" />
            <h3 className="display mt-5 text-3xl">Art in motion</h3>
            <p className="mt-4 text-[var(--muted)] leading-7">
              The palette work is rooted in painting practice, translated onto silk so it moves and catches light differently with every fold.
            </p>
          </div>
        </div>
      </section>

      <section className="container-pd pb-20 md:pb-24">
        <div className="grid gap-10 md:grid-cols-[0.68fr_1.32fr] md:items-center">
          <div>
            <p className="label">The artist</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Meet Batul</h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-[var(--muted)] md:text-lg">
            <p>
              Pure Designs by Batul is an independent studio shaped by a love of color, material, and objects that mean something.
            </p>
            <p>
              Each design begins as a visual note — a color, a texture, a fragment of memory — and becomes something meant to be worn, gifted, and kept close. The work stays intentionally small and personal, built around a refined eye rather than volume.
            </p>
            <Link href="/about" className="inline-block pt-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition-opacity hover:opacity-70">Read the full story</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
