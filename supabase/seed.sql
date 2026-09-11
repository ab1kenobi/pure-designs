insert into public.products
(name, slug, description, price, material, dimensions, category, images, inventory, is_active, is_featured)
values
(
  'Azure Garden',
  'azure-garden',
  'A graceful blue-and-ivory design created to bring color and movement to an everyday look.',
  100,
  'Silk',
  'Approx. 36 × 36 in',
  'Scarves',
  array['/images/showcase/scarf-1.jpg'],
  3,
  true,
  true
),
(
  'Golden Evening',
  'golden-evening',
  'A warm, luminous piece designed for evenings, celebrations, and thoughtful gifting.',
  100,
  'Silk',
  'Approx. 36 × 36 in',
  'Scarves',
  array['/images/showcase/scarf-4.jpg'],
  2,
  true,
  true
),
(
  'Rose Study',
  'rose-study',
  'A soft floral study balancing delicate tones with a bold artistic center.',
  100,
  'Silk blend',
  'Approx. 36 × 36 in',
  'Scarves',
  array['/images/showcase/scarf-2.jpg'],
  4,
  true,
  false
),
(
  'Midnight Garden',
  'midnight-garden',
  'A deeper palette for those who prefer their color dramatic, elegant, and quietly expressive.',
  100,
  'Silk',
  'Approx. 36 × 36 in',
  'Scarves',
  array['/images/showcase/scarf-3.jpg'],
  2,
  true,
  false
)
on conflict (slug) do nothing;