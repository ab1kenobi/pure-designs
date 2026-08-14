insert into public.products
(name, slug, description, price, material, dimensions, category, images, inventory, is_active, is_featured)
values
(
  'Azure Garden',
  'azure-garden',
  'A graceful blue-and-ivory design created to bring color and movement to an everyday look.',
  125,
  'Silk',
  'Approx. 36 × 36 in',
  'Signature',
  array['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85'],
  3,
  true,
  true
),
(
  'Golden Evening',
  'golden-evening',
  'A warm, luminous piece designed for evenings, celebrations, and thoughtful gifting.',
  150,
  'Silk',
  'Approx. 36 × 36 in',
  'Signature',
  array['https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=85'],
  2,
  true,
  true
),
(
  'Rose Study',
  'rose-study',
  'A soft floral study balancing delicate tones with a bold artistic center.',
  110,
  'Silk blend',
  'Approx. 36 × 36 in',
  'Floral',
  array['https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=1200&q=85'],
  4,
  true,
  false
),
(
  'Midnight Garden',
  'midnight-garden',
  'A deeper palette for those who prefer their color dramatic, elegant, and quietly expressive.',
  140,
  'Silk',
  'Approx. 36 × 36 in',
  'Signature',
  array['https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85'],
  2,
  true,
  false
)
on conflict (slug) do nothing;