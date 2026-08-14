import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) return new NextResponse("Missing signature", { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook verification failed", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session & {
      shipping_details?: {
        name?: string | null;
        address?: Stripe.Address | null;
      } | null;
    };
    const items = JSON.parse(session.metadata?.product_items || "[]") as { id: string; quantity: number }[];

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (!existing) {
      const { data: order, error } = await supabase.from("orders").insert({
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email || null,
        customer_phone: session.customer_details?.phone || null,
        total: (session.amount_total || 0) / 100,
        status: "paid",
        shipping_address: session.shipping_details?.address
          ? { name: session.shipping_details.name || null, ...session.shipping_details.address }
          : null
      }).select("id").single();

      if (error || !order) {
        console.error("Order creation failed", error);
        return new NextResponse("Order creation failed", { status: 500 });
      }

      const { data: products } = await supabase
        .from("products")
        .select("id, price")
        .in("id", items.map((i) => i.id));

      for (const item of items) {
        const product = products?.find((p) => p.id === item.id);
        if (!product) continue;

        await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: product.price
        });

        await supabase.rpc("decrement_inventory", {
          p_product_id: item.id,
          p_quantity: item.quantity
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
