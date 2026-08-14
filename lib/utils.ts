export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const SHIPPING_FEE_RATE = 0.1;

export function calculateShippingFee(subtotal: number) {
  return Math.round(subtotal * SHIPPING_FEE_RATE * 100) / 100;
}
