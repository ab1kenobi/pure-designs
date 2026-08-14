"use client";

import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return <button onClick={signOut} className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--berry)]">Sign out</button>;
}
