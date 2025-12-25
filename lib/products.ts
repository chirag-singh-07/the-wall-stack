export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  sizes?: { name: string; price: number }[];
  details?: string[];
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Geometric Harmony",
    price: 499,
    category: "minimal",
    image: "/minimal-geometric-black-white-poster-art.jpg",
  },
  {
    id: "2",
    title: "Abstract Flow",
    price: 599,
    category: "abstract",
    image: "/abstract-fluid-black-white-poster-art.jpg",
  },
  {
    id: "3",
    title: "Bold Statement",
    price: 449,
    category: "typography",
    image: "/typography-bold-black-white-poster-art.jpg",
  },
  {
    id: "4",
    title: "Silent Lines",
    price: 549,
    category: "minimal",
    image: "/minimal-lines-black-white-poster-art.jpg",
  },
  {
    id: "5",
    title: "Chaos Theory",
    price: 649,
    category: "abstract",
    image: "/abstract-chaotic-black-white-poster-art.jpg",
  },
  {
    id: "6",
    title: "Type Specimen",
    price: 529,
    category: "typography",
    image: "/typography-specimen-black-white-poster-art.jpg",
  },
  {
    id: "7",
    title: "Void Space",
    price: 479,
    category: "minimal",
    image: "/minimal-void-space-black-white-poster-art.jpg",
  },
  {
    id: "8",
    title: "Motion Blur",
    price: 579,
    category: "abstract",
    image: "/abstract-motion-blur-black-white-poster-art.jpg",
  },
];

export const collections: Collection[] = [
  {
    id: "minimal",
    title: "Minimal",
    description: "Clean lines, pure simplicity",
    image: "/minimal-collection-black-white-poster-art.jpg",
  },
  {
    id: "abstract",
    title: "Abstract",
    description: "Bold expressions, fluid forms",
    image: "/abstract-collection-black-white-poster-art.jpg",
  },
  {
    id: "typography",
    title: "Typography",
    description: "Words as art, letters as design",
    image: "/typography-collection-black-white-poster-art.jpg",
  },
];

export const allProducts: Product[] = [
  ...products,
  {
    id: "9",
    title: "Urban Grid",
    price: 54,
    category: "minimal",
    image: "/minimal-urban-grid-black-white-poster-art.jpg",
  },
  {
    id: "10",
    title: "Ink Splash",
    price: 62,
    category: "abstract",
    image: "/abstract-ink-splash-black-white-poster-art.jpg",
  },
  {
    id: "11",
    title: "Quote Art",
    price: 47,
    category: "typography",
    image: "/typography-quote-black-white-poster-art.jpg",
  },
  {
    id: "12",
    title: "Zen Circle",
    price: 51,
    category: "minimal",
    image: "/minimal-zen-circle-black-white-poster-art.jpg",
  },
  {
    id: "13",
    title: "Wave Form",
    price: 67,
    category: "abstract",
    image: "/abstract-wave-form-black-white-poster-art.jpg",
  },
  {
    id: "14",
    title: "Letter Play",
    price: 53,
    category: "typography",
    image: "/typography-letter-play-black-white-poster-art.jpg",
  },
  {
    id: "15",
    title: "Dot Matrix",
    price: 46,
    category: "minimal",
    image: "/minimal-dot-matrix-black-white-poster-art.jpg",
  },
  {
    id: "16",
    title: "Smoke & Mirrors",
    price: 72,
    category: "abstract",
    image: "/abstract-smoke-black-white-poster-art.jpg",
  },
];

export const priceRanges = [
  { label: "Under ₹500", min: 0, max: 499 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { label: "Over ₹2000", min: 2000, max: 99999 },
];

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

export const productDetails: Record<
  string,
  Omit<Product, "id" | "title" | "price" | "category" | "image">
> = {
  "1": {
    description:
      "A masterful blend of geometric precision and artistic expression. This poster features carefully balanced shapes that create visual harmony, perfect for modern spaces seeking a touch of sophisticated minimalism.",
    sizes: [
      { name: "A4 (21×30cm)", price: 299 },
      { name: "A3 (30×42cm)", price: 499 },
      { name: "A2 (42×59cm)", price: 799 },
      { name: "A1 (59×84cm)", price: 1199 },
    ],
    details: [
      "Premium 250gsm matte art paper",
      "Archival quality inks",
      "Ships in protective tube",
      "Handcrafted in studio",
    ],
  },
  "2": {
    description:
      "Fluid organic forms dance across the canvas in this captivating abstract piece. The interplay of light and shadow creates depth and movement, making it a stunning centerpiece for any contemporary interior.",
    sizes: [
      { name: "A4 (21×30cm)", price: 399 },
      { name: "A3 (30×42cm)", price: 599 },
      { name: "A2 (42×59cm)", price: 899 },
      { name: "A1 (59×84cm)", price: 1299 },
    ],
    details: [
      "Premium 250gsm matte art paper",
      "Archival quality inks",
      "Ships in protective tube",
      "Limited edition print",
    ],
  },
  "3": {
    description:
      "Bold typography meets artistic expression in this striking poster. Each letter has been carefully crafted to create visual impact while maintaining readability and artistic integrity.",
    sizes: [
      { name: "A4 (21×30cm)", price: 249 },
      { name: "A3 (30×42cm)", price: 449 },
      { name: "A2 (42×59cm)", price: 749 },
      { name: "A1 (59×84cm)", price: 1149 },
    ],
    details: [
      "Premium 250gsm matte art paper",
      "Archival quality inks",
      "Ships in protective tube",
      "Typography collection piece",
    ],
  },
};

export function getProductWithDetails(id: string):
  | (Product & {
      description: string;
      sizes: { name: string; price: number }[];
      details: string[];
    })
  | null {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return null;

  const details = productDetails[id] || {
    description:
      "A stunning piece of minimalist art that brings elegance and sophistication to any space. Each print is carefully produced using premium materials to ensure lasting quality and visual impact.",
    sizes: [
      { name: "A4 (21×30cm)", price: Math.round(product.price * 0.6) },
      { name: "A3 (30×42cm)", price: product.price },
      { name: "A2 (42×59cm)", price: Math.round(product.price * 1.6) },
      { name: "A1 (59×84cm)", price: Math.round(product.price * 2.4) },
    ],
    details: [
      "Premium 250gsm matte art paper",
      "Archival quality inks",
      "Ships in protective tube",
      "Handcrafted in studio",
    ],
  };

  const finalDetails = {
    description:
      details.description || product.description || "No description available.",
    sizes: details.sizes || [],
    details: details.details || [],
  };

  return { ...product, ...finalDetails };
}

export function getRecommendedProducts(
  currentId: string,
  category: string,
  limit = 4
): Product[] {
  return allProducts
    .filter((p) => p.id !== currentId)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === category && b.category !== category) return -1;
      if (b.category === category && a.category !== category) return 1;
      return 0;
    })
    .slice(0, limit);
}
