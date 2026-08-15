import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CATEGORY_PRICES = {
  Scarves: 100,
  Purses: 50
} as const;

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  category: z.enum(["Scarves", "Purses"]),
  inventory: z.number().int().min(0),
  images: z.array(z.string().url()).min(1),
  is_featured: z.boolean()
});

export async function POST(request: Request) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").insert({ ...data, price: CATEGORY_PRICES[data.category], is_active: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
  }
}
