import Link from "next/link";
import { ClearCart } from "@/components/clear-cart";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  return (
    <main className="container-pd py-24 text-center">
      {session_id && <ClearCart />}
      <p className="label">Thank you</p>
      <h1 className="display text-6xl mt-4">Your payment is confirmed.</h1>
      <div className="thread-rule-thin mx-auto mt-6" />
      <p className="max-w-xl mx-auto mt-6 text-[var(--muted)] leading-7">
        Your payment was sent securely through Stripe. We'll use the information
        provided at checkout to fulfill and ship your order — or, for a bespoke
        piece, to follow up and start bringing it to life.
      </p>
      {session_id && <p className="text-xs text-[var(--muted)] mt-8">Order reference: {session_id}</p>}
      <Link href="/shop" className="btn btn-dark mt-10 inline-flex">Continue shopping</Link>
    </main>
  );
}
