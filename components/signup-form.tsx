"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) setError(error.message);
    else setMessage("Check your email to confirm your account.");
  }

  return (
    <form onSubmit={submit} className="space-y-4 mt-9">
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
      <input required minLength={8} type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
      <button className="btn btn-dark w-full">Create account</button>
      {error && <p className="text-sm text-[var(--berry)]">{error}</p>}
      {message && <p className="text-sm text-[var(--teal)]">{message}</p>}
      <p className="text-sm text-[var(--muted)] text-center">Already have an account? <Link className="underline decoration-[var(--saffron)] underline-offset-4" href="/auth/login">Sign in</Link></p>
    </form>
  );
}
