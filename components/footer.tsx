import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20">
      <div className="fringe" />
      <div className="bg-[var(--ink)] text-[var(--paper)]">
        <div className="container-pd grid gap-10 py-14 md:grid-cols-[1.2fr_0.7fr_1fr] md:py-16">
          <div>
            <div className="display text-[1.9rem]">Pure Designs by Batul</div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--paper)]/70">
              Hand-dyed silk scarves and bespoke pieces, designed and finished by hand in small runs.
            </p>
            <div className="thread-rule-thin mt-6" />
          </div>

          <div className="space-y-3 text-sm text-[var(--paper)]/80">
            <Link href="/shop" className="block transition-colors hover:text-[var(--saffron)]">Shop</Link>
            <Link href="/bespoke" className="block transition-colors hover:text-[var(--saffron)]">Bespoke</Link>
            <Link href="/about" className="block transition-colors hover:text-[var(--saffron)]">About</Link>
          </div>

          <div className="text-sm text-[var(--paper)]/80">
            <p className="label text-[var(--paper)]/50">Contact</p>
            <p className="mt-4">hello@puredesignsbybatul.com</p>
            <p className="mt-2">Instagram / @puredesignsbybatul</p>
          </div>
        </div>

        <div className="container-pd border-t border-[var(--paper)]/15 py-5 text-[10px] uppercase tracking-[0.18em] text-[var(--paper)]/50">
          © {new Date().getFullYear()} Pure Designs by Batul
        </div>
      </div>
    </footer>
  );
}
