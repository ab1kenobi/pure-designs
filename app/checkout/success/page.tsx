import Link from "next/link";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  return (
    <main className="container-pd py-24 text-center">
      <p className="label">Thank you</p>
      <h1 className="display text-6xl mt-4">Your order is on its way.</h1>
      <div className="thread-rule-thin mx-auto mt-6" />
      <p className="max-w-xl mx-auto mt-6 text-[var(--muted)] leading-7">
        Your payment was sent securely through Stripe. We'll use the information
        provided at checkout to fulfill your order.
      </p>
      {session_id && <p className="text-xs text-[var(--muted)] mt-8">Order reference: {session_id}</p>}
      <Link href="/shop" className="btn btn-dark mt-10 inline-flex">Continue shopping</Link>
    </main>
  );
}
