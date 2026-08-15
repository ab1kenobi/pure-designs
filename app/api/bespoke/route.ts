import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const BESPOKE_PRICING = {
  scarf: { label: "Bespoke scarf", cents: 15000 },
  purse: { label: "Bespoke purse", cents: 7500 },
  set: { label: "Bespoke scarf + purse set", cents: 17500 }
} as const;

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  type: z.enum(["scarf", "purse", "set"]),
  colors: z.string().max(500).optional(),
  occasion: z.string().max(200).optional(),
  description: z.string().min(10).max(3000),
  inspiration_url: z.string().url().optional().or(z.literal(""))
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const pricing = BESPOKE_PRICING[data.type];
    const supabase = createAdminClient();

    const { data: bespokeRequest, error } = await supabase
      .from("bespoke_requests")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        colors: data.colors || null,
        occasion: data.occasion || null,
        description: data.description,
        inspiration_url: data.inspiration_url || null,
        type: data.type,
        price: pricing.cents / 100,
        status: "pending_payment"
      })
      .select("id")
      .single();

    if (error || !bespokeRequest) {
      console.error(error);
      return NextResponse.json({ error: "Could not submit request." }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pricing.cents,
          product_data: { name: pricing.label }
        }
      }],
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      customer_email: data.email,
      customer_creation: "always",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/bespoke`,
      metadata: {
        bespoke_request_id: bespokeRequest.id
      }
    });

    await supabase.from("bespoke_requests").update({ stripe_session_id: session.id }).eq("id", bespokeRequest.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Please check your information." }, { status: 400 });
  }
}
