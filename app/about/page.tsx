export default function AboutPage() {
  return (
    <main className="container-pd py-14 md:py-20">
      <div className="max-w-3xl">
        <p className="label">About</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">The story behind Pure Designs by Batul</h1>
        <div className="thread-rule-thin mt-6" />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="scarf-card">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85"
            alt="Artist working with textiles"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>

        <div className="space-y-6 text-base leading-8 text-[var(--muted)] md:text-lg">
          <p>
            Pure Designs by Batul began with a simple idea: beautiful objects should feel personal, refined, and full of intention. The work is rooted in a love of texture, color, and the stories a person carries with them.
          </p>
          <p>
            Batul draws inspiration from everyday rituals, travel, architecture, and gathered fragments of memory. Those inspirations become scarves that feel collected rather than mass-produced, designed to bring softness and character into a wardrobe.
          </p>
          <p>
            Every collection is intentionally small and considered. The goal is not excess, but meaning — pieces that feel elevated, useful, and deeply personal.
          </p>
        </div>
      </div>
    </main>
  );
}
