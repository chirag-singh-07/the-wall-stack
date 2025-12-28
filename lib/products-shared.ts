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

// Static fallback data for development/fallback
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

// Keep existing exports for backward compatibility if used elsewhere
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
};
