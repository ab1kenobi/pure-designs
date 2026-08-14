"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const supabase = createClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = "/account";
  }

  return (
    <form onSubmit={submit} className="space-y-4 mt-9">
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
      <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
      <button className="btn btn-dark w-full">Sign in</button>
      {error && <p className="text-sm text-[var(--berry)]">{error}</p>}
      <p className="text-sm text-[var(--muted)] text-center">New here? <Link className="underline decoration-[var(--saffron)] underline-offset-4" href="/auth/signup">Create an account</Link></p>
    </form>
  );
}
