# Pure Designs by Batul

A premium direct-to-consumer scarf storefront for Pure Designs by Batul.

## V1 goals

- Luxury editorial storefront
- Product catalog with inventory
- Product detail pages
- Local cart
- Guest checkout
- Optional customer accounts
- Stripe-hosted checkout
- Stripe webhook order fulfillment
- Bespoke scarf inquiry workflow
- Admin dashboard for orders, bespoke requests, and products
- Art-fair QR-code friendly experience
- Responsive mobile-first UI

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4-style utility classes via the current Next.js setup
- Supabase Postgres + Auth
- Stripe Checkout
- Vercel deployment

Next.js App Router is the recommended routing model for new Next.js applications. Supabase's current Next.js guidance uses `@supabase/ssr` for cookie-based SSR auth, and Stripe recommends Checkout Sessions plus server-side webhooks for fulfillment.

## 1. Install

```bash
npm install
```

## 2. Create Supabase project

Create a project at https://supabase.com.

Copy the project URL and publishable key into `.env.local`.

Then run:

```bash
supabase/schema.sql
```

in the Supabase SQL Editor.

Create an Auth user for your mom using the email in `ADMIN_EMAIL`.

## 3. Stripe

Create a Stripe account and obtain a test secret key.

Set:

```bash
STRIPE_SECRET_KEY=sk_test_...
```

For local development:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the generated `whsec_...` into:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

The webhook is important: the success page is not the source of truth for payment. Stripe sends `checkout.session.completed` to the webhook, where the order is fulfilled and inventory is updated.

## 4. Run

```bash
npm run dev
```

Open:

http://localhost:3000

## 5. Seed products

Run `supabase/seed.sql` in Supabase after `schema.sql`.

The seed uses placeholder images. Replace those URLs with real scarf photography before the art fair.

## 6. Production

Recommended:

1. Push repository to GitHub.
2. Import into Vercel.
3. Add all environment variables.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
5. Create a Stripe production webhook:
   `https://YOUR_DOMAIN.com/api/stripe/webhook`
6. Enable `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
7. Test a real $1-$2 product before the art fair.
8. Generate a QR code pointing to `/shop`.

## V1 content checklist

Replace:
- product names
- descriptions
- materials
- dimensions
- inventory
- real photos
- Batul's biography
- Instagram handle
- contact email
- shipping/pickup policy
- return policy

## Important inventory behavior

Inventory is decremented by the Stripe webhook after payment. The checkout route validates current stock before creating a Checkout Session.

For a small art-fair catalog this is sufficient. If inventory becomes large/high-volume, add database reservation/locking around checkout.

## Future V2

- Shipping label generation
- Automated customer emails
- Product photo uploads from admin
- Discount codes
- Reviews
- Analytics
- Instagram feed
- Bespoke quote/payment workflow
- Abandoned cart recovery
- Customer wishlist
- Stripe Tax
- Multiple currencies
# pure-designs
