import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPieceRequestNotification } from "@/lib/email";

const schema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional()
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: product, error } = await supabase
      .from("products")
      .select("id, name, price, is_active")
      .eq("id", data.productId)
      .maybeSingle();

    if (error || !product || !product.is_active) {
      return NextResponse.json({ error: "This piece is no longer available." }, { status: 400 });
    }

    await sendPieceRequestNotification({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
      productName: product.name,
      productPrice: product.price !== null ? Number(product.price) : null
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Please check your information." }, { status: 400 });
  }
}
