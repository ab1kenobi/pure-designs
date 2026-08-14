import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { SHIPPING_FEE_RATE } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const schema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().int().min(1).max(10)
  })).min(1)
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const supabase = createAdminClient();

    const ids = body.items.map((x) => x.id);
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price, inventory, images, is_active")
      .in("id", ids);

    if (error || !products) return NextResponse.json({ error: "Unable to load products." }, { status: 400 });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let subtotalCents = 0;

    for (const item of body.items) {
      const product = products.find((p) => p.id === item.id);
      if (!product || !product.is_active) return NextResponse.json({ error: "A product is unavailable." }, { status: 400 });
      if (product.inventory < item.quantity) {
        return NextResponse.json({ error: `${product.name} does not have enough inventory.` }, { status: 409 });
      }

      const unitAmount = Math.round(Number(product.price) * 100);
      subtotalCents += unitAmount * item.quantity;

      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: product.name,
            images: product.images?.[0] ? [product.images[0]] : undefined
          }
        }
      });
    }

    const shippingCents = Math.round(subtotalCents * SHIPPING_FEE_RATE);
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: shippingCents,
        product_data: { name: "Shipping & handling" }
      }
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      customer_creation: "always",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        product_items: JSON.stringify(body.items)
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}
