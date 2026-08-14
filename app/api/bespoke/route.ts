import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  budget: z.string().max(100).optional(),
  colors: z.string().max(500).optional(),
  occasion: z.string().max(200).optional(),
  description: z.string().min(10).max(3000),
  inspiration_url: z.string().url().optional().or(z.literal(""))
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const supabase = createAdminClient();

    const { error } = await supabase.from("bespoke_requests").insert(data);
    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Could not submit request." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Please check your information." }, { status: 400 });
  }
}
