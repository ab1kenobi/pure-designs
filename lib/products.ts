import { createAdminClient } from "@/lib/supabase/admin";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  material: string | null;
  dimensions: string | null;
  category: string;
  images: string[];
  inventory: number;
  is_active: boolean;
  is_featured: boolean;
};

export async function getProducts() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []) as Product[];
  } catch (error) {
    console.warn("Falling back to empty products list:", error);
    return [] as Product[];
  }
}

export async function getFeaturedProducts() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) throw new Error(error.message);
    return (data || []) as Product[];
  } catch (error) {
    console.warn("Falling back to empty featured products:", error);
    return [] as Product[];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as Product | null;
  } catch (error) {
    console.warn(`Falling back to no product for slug ${slug}:`, error);
    return null;
  }
}
