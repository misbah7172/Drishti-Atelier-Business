/**
 * Drishti Atelier — Product Data Service
 * Real product inventory mapped to HEAVN-grade editorial architecture
 * Strict Color Palette: Black, White, Gray, and #F97D01
 */

export const PRODUCTS = [
  {
    id: 1,
    slug: 'vapour-titanium-aviator',
    name: 'Vapour Titanium Aviator',
    code: 'ATELIER 01 — SUN',
    category: 'sunglasses',
    categoryLabel: 'Sunglasses',
    price: 240,
    comparePrice: 320,
    material: 'Japanese Grade-5 Titanium',
    shape: 'Aviator',
    gender: 'Unisex',
    image: '/images/blue-aviator.png',
    hoverImage: '/images/amber-aviator.png',
    gallery: [
      { id: 'front', label: 'Front Symmetry', src: '/images/blue-aviator.png', caption: 'Symmetrical optical balance with dual caustics.' },
      { id: 'profile45', label: '45° Angle', src: '/images/amber-aviator.png', caption: 'Three-quarter depth showing brow arch & lens bevel.' },
      { id: 'temple', label: 'Temple Hinge', src: '/images/hero-glasses.png', caption: 'Five-barrel monobloc hinge and tapered earstems.' },
      { id: 'lifestyle', label: 'Worn on Face', src: '/images/lifestyle-model.png', caption: 'Natural human proportions in ambient street light.' },
    ],
    colors: [
      { name: 'Silver / Cobalt', hex: '#C0C0C0' },
      { name: 'Gold / Amber', hex: '#D4AF37' },
      { name: 'Matte Obsidian', hex: '#1A1A1A' },
    ],
    badge: 'Iconic',
    weight: '18.4g',
    lensWidth: '51 mm',
    bridgeWidth: '19 mm',
    templeLength: '145 mm',
    lensType: 'CR-39 Polarized UV400',
    description:
      'Laser-cut from cold-rolled Japanese titanium alloy. The elevated top brow bar provides dynamic torsional rigidity while weighing under 4.2 grams. Custom crystal optics with 8-layer anti-reflective interior coating ensure crystalline clarity in overhead sunlight.',
    features: [
      'Japanese Grade-5 Titanium chassis',
      '8-layer interior anti-reflective coating',
      'Monobloc screwless 5-barrel hinges',
      'Hypoallergenic medical-grade silicone nose pads',
    ],
    stock: 45,
    featured: true,
  },
  {
    id: 2,
    slug: 'amber-horizon-navigator',
    name: 'Amber Horizon Navigator',
    code: 'ATELIER 02 — SUN',
    category: 'sunglasses',
    categoryLabel: 'Sunglasses',
    price: 260,
    comparePrice: 340,
    material: 'Handcrafted Acetate & Metal',
    shape: 'Aviator',
    gender: 'Unisex',
    image: '/images/amber-aviator.png',
    hoverImage: '/images/blue-aviator.png',
    gallery: [
      { id: 'front', label: 'Front View', src: '/images/amber-aviator.png', caption: 'Warm amber caustics on gold wireframe.' },
      { id: 'alt', label: 'Alternate Angle', src: '/images/blue-aviator.png', caption: 'Profile curvature and temple architecture.' },
      { id: 'wire', label: 'Wire Architecture', src: '/images/hero-glasses.png', caption: 'Precision balance and bridge ergonomics.' },
      { id: 'lifestyle', label: 'Editorial Model', src: '/images/lifestyle-model.png', caption: 'Worn on face under golden hour sun.' },
    ],
    colors: [
      { name: 'Raw Gold', hex: '#D4AF37' },
      { name: 'Tortoise Havana', hex: '#8B4513' },
      { name: 'Obsidian Black', hex: '#1A1A1A' },
    ],
    badge: 'Limited Run',
    weight: '21.0g',
    lensWidth: '53 mm',
    bridgeWidth: '18 mm',
    templeLength: '142 mm',
    lensType: 'Amber Gradient UV400',
    description:
      'Warm optical warmth meets structural poise. Features gold wireframe architecture with hand-finished amber lenses designed to enhance warm tones and contrast in coastal and city sunlight.',
    features: [
      'Dual brow architecture with balanced weight distribution',
      'Enhanced depth contrast amber optics',
      'Friction dampening hinge mechanism',
      'Laser-etched serial numbering on interior temple',
    ],
    stock: 35,
    featured: true,
  },
  {
    id: 3,
    slug: 'monolith-optical-wire',
    name: 'Monolith Optical Wire',
    code: 'ATELIER 03 — OPTICAL',
    category: 'prescription-glasses',
    categoryLabel: 'Optical Frames',
    price: 210,
    comparePrice: 280,
    material: 'Cold-Rolled Beta Titanium',
    shape: 'Rectangle',
    gender: 'Unisex',
    image: '/images/hero-glasses.png',
    hoverImage: '/images/blue-aviator.png',
    gallery: [
      { id: 'front', label: 'Studio Minimal', src: '/images/hero-glasses.png', caption: 'Black wireframe with zero light distortion.' },
      { id: 'profile', label: 'Side Silhouette', src: '/images/blue-aviator.png', caption: 'Featherweight 14.2g titanium geometry.' },
      { id: 'lifestyle', label: 'Editorial Campaign', src: '/images/lifestyle-model.png', caption: 'Architectural clarity for everyday wear.' },
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#050505' },
      { name: 'Charcoal Titanium', hex: '#555555' },
      { name: 'Brushed Silver', hex: '#C0C0C0' },
    ],
    badge: 'Best Seller',
    weight: '14.2g',
    lensWidth: '50 mm',
    bridgeWidth: '19 mm',
    templeLength: '140 mm',
    lensType: 'Single Vision / Progressive Ready',
    description:
      'Engineered for long focus sessions. The Monolith wireframe strips away all extraneous ornamentation to focus purely on structural balance and anatomical comfort across 16-hour work days.',
    features: [
      'Ultra-thin 0.7mm beta-titanium wire rim',
      'Zero-slip micro-textured nose bridge',
      'Accommodates high-index prescription lenses up to -8.00',
      'Ultra-flexible temples that self-adjust without pinching',
    ],
    stock: 50,
    featured: true,
  },
  {
    id: 4,
    slug: 'heart-contour-statement',
    name: 'Heart Contour Statement',
    code: 'ATELIER 04 — STATEMENT',
    category: 'sunglasses',
    categoryLabel: 'Sunglasses',
    price: 280,
    comparePrice: 350,
    material: 'Monobloc Sculpted Metal',
    shape: 'Statement',
    gender: 'Women',
    image: '/images/heart-sunglasses.png',
    hoverImage: '/images/amber-aviator.png',
    gallery: [
      { id: 'front', label: 'Statement Front', src: '/images/heart-sunglasses.png', caption: 'Sculpted heart curves with sapphire blue lenses.' },
      { id: 'alt', label: 'Three-Quarter', src: '/images/amber-aviator.png', caption: 'Polished gold edge highlights.' },
      { id: 'lifestyle', label: 'Campaign View', src: '/images/lifestyle-model.png', caption: 'High-fashion editorial presence.' },
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Polished Chrome', hex: '#C0C0C0' },
      { name: 'Rose Metallic', hex: '#999999' },
    ],
    badge: 'Editorial Pick',
    weight: '22.8g',
    lensWidth: '54 mm',
    bridgeWidth: '17 mm',
    templeLength: '140 mm',
    lensType: 'Sapphire Gradient UV400',
    description:
      'A sculptural statement piece that reinterprets avant-garde geometric silhouettes through precision metal craft. Vibrant optical caustics catch ambient light from every viewing angle.',
    features: [
      'Artisanal hand-bent outer wire contour',
      'Custom sapphire tint with hydrophobic outer seal',
      'Smooth contour nose pads',
      'Includes custom architectural hardcase and microfiber pouch',
    ],
    stock: 22,
    featured: true,
  },
  {
    id: 5,
    slug: 'digital-shield-titanium',
    name: 'DigitalShield Pro Titanium',
    code: 'ATELIER 05 — BLUE LIGHT',
    category: 'blue-light-glasses',
    categoryLabel: 'Blue Light Optics',
    price: 195,
    comparePrice: 250,
    material: 'Japanese Grade-5 Titanium',
    shape: 'Rectangle',
    gender: 'Unisex',
    image: '/images/hero-glasses.png',
    hoverImage: '/images/blue-aviator.png',
    gallery: [
      { id: 'front', label: 'Front Architecture', src: '/images/hero-glasses.png', caption: 'Crystal clear lenses with selective blue filtering.' },
      { id: 'model', label: 'Workspace View', src: '/images/lifestyle-model.png', caption: 'Engineered for intensive screen work.' },
    ],
    colors: [
      { name: 'Matte Obsidian', hex: '#050505' },
      { name: 'Satin Slate', hex: '#444444' },
      { name: 'Platinum Silver', hex: '#C0C0C0' },
    ],
    badge: 'New Arrival',
    weight: '15.1g',
    lensWidth: '51 mm',
    bridgeWidth: '18 mm',
    templeLength: '143 mm',
    lensType: 'Anti-Blue Light & Glare Shield',
    description:
      'Filters 42% of high-energy 415-455nm blue light emitted by OLED and LED displays while preserving true color fidelity without yellow discoloration.',
    features: [
      'Clear non-yellowing blue light filtration',
      'Dual-side oleophobic and anti-smudge barrier',
      'Flexible titanium temples designed for headsets',
      'Endorsed for digital creatives and engineers',
    ],
    stock: 60,
    featured: false,
  },
  {
    id: 6,
    slug: 'zenith-rimless-titanium',
    name: 'Zenith Rimless Titanium',
    code: 'ATELIER 06 — OPTICAL',
    category: 'prescription-glasses',
    categoryLabel: 'Optical Frames',
    price: 290,
    comparePrice: 380,
    material: 'Pure Japanese Titanium',
    shape: 'Round',
    gender: 'Unisex',
    image: '/images/blue-aviator.png',
    hoverImage: '/images/hero-glasses.png',
    gallery: [
      { id: 'front', label: 'Minimal Rimless', src: '/images/blue-aviator.png', caption: 'Barely-there 12.0g pure titanium mount.' },
      { id: 'angle', label: 'Temple Mount', src: '/images/amber-aviator.png', caption: 'Precision-drilled compression bushings.' },
      { id: 'lifestyle', label: 'Natural Face', src: '/images/lifestyle-model.png', caption: 'Unobstructed natural facial expression.' },
    ],
    colors: [
      { name: 'Raw Titanium', hex: '#888888' },
      { name: 'Obsidian Black', hex: '#050505' },
      { name: 'Polished Silver', hex: '#C0C0C0' },
    ],
    badge: 'Architectural',
    weight: '12.0g',
    lensWidth: '49 mm',
    bridgeWidth: '20 mm',
    templeLength: '145 mm',
    lensType: 'High-Index Polycarbonate',
    description:
      'Weighing merely 12 grams, the Zenith Rimless is the purest distillation of optical design. With no outer frame to obstruct sightlines, it provides a seamless field of view.',
    features: [
      'Precision laser-drilled compression mountings',
      'Zero frame obstruction across 180° field of view',
      'Pressure-absorbing beta-titanium temple stems',
      'Hypoallergenic titanium nose pads',
    ],
    stock: 18,
    featured: false,
  },
];

export function getProductById(id) {
  const numericId = parseInt(id, 10);
  return PRODUCTS.find((p) => p.id === numericId) || PRODUCTS[0];
}

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
}

export function getFilteredProducts({ category, shape, material, search, sort }) {
  let list = [...PRODUCTS];

  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category || (category === 'new' && p.badge === 'New Arrival'));
  }

  if (shape && shape !== 'all') {
    list = list.filter((p) => p.shape.toLowerCase() === shape.toLowerCase());
  }

  if (material && material !== 'all') {
    list = list.filter((p) => p.material.toLowerCase().includes(material.toLowerCase()));
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    list.sort((a, b) => b.id - a.id);
  }

  return list;
}
