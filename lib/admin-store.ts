"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff"
  avatar?: string
  joinedDate: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  joinedDate: string
  status: "active" | "inactive"
}

export interface AdminOrder {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: {
    productId: string
    title: string
    image: string
    size: string
    quantity: number
    price: number
  }[]
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
}

export interface CustomPosterOrder {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  date: string
  status: "pending" | "in-progress" | "review" | "approved" | "completed" | "cancelled"
  description: string
  size: string
  budget: number
  referenceImages?: string[]
  designNotes?: string
  finalDesign?: string
}

export interface AdminProduct {
  id: string
  title: string
  price: number
  category: string
  image: string
  description: string
  stock: number
  status: "active" | "draft" | "archived"
  createdAt: string
  updatedAt: string
}

export interface AdminCollection {
  id: string
  title: string
  description: string
  image: string
  productCount: number
  status: "active" | "draft"
  createdAt: string
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  status: "active" | "inactive"
  createdAt: string
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

// Sample data
const sampleCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    totalOrders: 5,
    totalSpent: 485,
    joinedDate: "2024-01-15",
    status: "active",
  },
  {
    id: "cust-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 234-5678",
    totalOrders: 3,
    totalSpent: 267,
    joinedDate: "2024-02-20",
    status: "active",
  },
  {
    id: "cust-3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 345-6789",
    totalOrders: 8,
    totalSpent: 892,
    joinedDate: "2023-11-10",
    status: "active",
  },
  {
    id: "cust-4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+1 (555) 456-7890",
    totalOrders: 2,
    totalSpent: 134,
    joinedDate: "2024-03-05",
    status: "inactive",
  },
  {
    id: "cust-5",
    name: "Michael Wilson",
    email: "m.wilson@example.com",
    phone: "+1 (555) 567-8901",
    totalOrders: 12,
    totalSpent: 1456,
    joinedDate: "2023-08-22",
    status: "active",
  },
]

const sampleAdminOrders: AdminOrder[] = [
  {
    id: "ORD-2024-001",
    customerId: "cust-1",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    date: "2024-12-10",
    status: "delivered",
    items: [
      {
        productId: "1",
        title: "Geometric Harmony",
        image: "/minimal-geometric-black-white-poster-art.jpg",
        size: "A3 (30×42cm)",
        quantity: 1,
        price: 49,
      },
    ],
    total: 49,
    shippingAddress: {
      street: "123 Art Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-2024-002",
    customerId: "cust-2",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    date: "2024-12-15",
    status: "shipped",
    items: [
      {
        productId: "5",
        title: "Chaos Theory",
        image: "/abstract-chaotic-black-white-poster-art.jpg",
        size: "A1 (59×84cm)",
        quantity: 2,
        price: 155,
      },
    ],
    total: 310,
    shippingAddress: {
      street: "456 Design Blvd",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "United States",
    },
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-2024-003",
    customerId: "cust-3",
    customerName: "Robert Johnson",
    customerEmail: "robert.j@example.com",
    date: "2024-12-16",
    status: "processing",
    items: [
      {
        productId: "2",
        title: "Abstract Flow",
        image: "/abstract-fluid-black-white-poster-art.jpg",
        size: "A2 (42×59cm)",
        quantity: 1,
        price: 89,
      },
      {
        productId: "3",
        title: "Bold Statement",
        image: "/typography-bold-black-white-poster-art.jpg",
        size: "A3 (30×42cm)",
        quantity: 1,
        price: 45,
      },
    ],
    total: 134,
    shippingAddress: {
      street: "789 Creative Lane",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "United States",
    },
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-2024-004",
    customerId: "cust-5",
    customerName: "Michael Wilson",
    customerEmail: "m.wilson@example.com",
    date: "2024-12-17",
    status: "pending",
    items: [
      {
        productId: "7",
        title: "Void Space",
        image: "/minimal-void-space-black-white-poster-art.jpg",
        size: "A1 (59×84cm)",
        quantity: 1,
        price: 115,
      },
    ],
    total: 115,
    shippingAddress: {
      street: "321 Modern Ave",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "United States",
    },
    paymentMethod: "Bank Transfer",
  },
]

const sampleCustomPosterOrders: CustomPosterOrder[] = [
  {
    id: "CPO-2024-001",
    customerId: "cust-1",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    date: "2024-12-05",
    status: "completed",
    description:
      "Looking for a minimalist poster with geometric shapes, similar to Bauhaus style. Black and white only.",
    size: "A2 (42×59cm)",
    budget: 150,
    designNotes: "Customer approved final design on first revision.",
  },
  {
    id: "CPO-2024-002",
    customerId: "cust-3",
    customerName: "Robert Johnson",
    customerEmail: "robert.j@example.com",
    date: "2024-12-12",
    status: "in-progress",
    description:
      "Abstract poster for office space. Would like flowing lines and organic shapes. Prefer a calming aesthetic.",
    size: "A1 (59×84cm)",
    budget: 200,
    designNotes: "Working on second draft based on feedback.",
  },
  {
    id: "CPO-2024-003",
    customerId: "cust-5",
    customerName: "Michael Wilson",
    customerEmail: "m.wilson@example.com",
    date: "2024-12-16",
    status: "pending",
    description:
      "Typography-focused poster with a custom quote. Modern, clean aesthetic. Quote: 'Design is thinking made visual'",
    size: "A3 (30×42cm)",
    budget: 100,
  },
  {
    id: "CPO-2024-004",
    customerId: "cust-2",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    date: "2024-12-17",
    status: "review",
    description:
      "Set of 3 coordinating posters for living room. Minimal style with subtle texture. Would like them to work as a triptych.",
    size: "A2 (42×59cm)",
    budget: 350,
    designNotes: "Sent first draft for customer review.",
  },
]

const sampleProducts: AdminProduct[] = [
  {
    id: "1",
    title: "Geometric Harmony",
    price: 49,
    category: "minimal",
    image: "/minimal-geometric-black-white-poster-art.jpg",
    description: "A masterful blend of geometric precision and artistic expression.",
    stock: 45,
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-12-01",
  },
  {
    id: "2",
    title: "Abstract Flow",
    price: 59,
    category: "abstract",
    image: "/abstract-fluid-black-white-poster-art.jpg",
    description: "Fluid organic forms dance across the canvas.",
    stock: 32,
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-11-28",
  },
  {
    id: "3",
    title: "Bold Statement",
    price: 45,
    category: "typography",
    image: "/typography-bold-black-white-poster-art.jpg",
    description: "Bold typography meets artistic expression.",
    stock: 58,
    status: "active",
    createdAt: "2024-02-01",
    updatedAt: "2024-12-05",
  },
  {
    id: "4",
    title: "Silent Lines",
    price: 55,
    category: "minimal",
    image: "/minimal-lines-black-white-poster-art.jpg",
    description: "Clean lines create a sense of calm and order.",
    stock: 28,
    status: "active",
    createdAt: "2024-02-15",
    updatedAt: "2024-11-20",
  },
  {
    id: "5",
    title: "Chaos Theory",
    price: 65,
    category: "abstract",
    image: "/abstract-chaotic-black-white-poster-art.jpg",
    description: "Controlled chaos in black and white.",
    stock: 15,
    status: "active",
    createdAt: "2024-03-01",
    updatedAt: "2024-12-10",
  },
]

const sampleCollections: AdminCollection[] = [
  {
    id: "minimal",
    title: "Minimal",
    description: "Clean lines, pure simplicity",
    image: "/minimal-collection-black-white-poster-art.jpg",
    productCount: 5,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "abstract",
    title: "Abstract",
    description: "Bold expressions, fluid forms",
    image: "/abstract-collection-black-white-poster-art.jpg",
    productCount: 5,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "typography",
    title: "Typography",
    description: "Words as art, letters as design",
    image: "/typography-collection-black-white-poster-art.jpg",
    productCount: 4,
    status: "active",
    createdAt: "2024-01-01",
  },
]

const sampleCategories: AdminCategory[] = [
  {
    id: "cat-1",
    name: "Minimal",
    slug: "minimal",
    description: "Clean, simple designs with minimal elements",
    productCount: 5,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "cat-2",
    name: "Abstract",
    slug: "abstract",
    description: "Bold, expressive abstract artwork",
    productCount: 5,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "cat-3",
    name: "Typography",
    slug: "typography",
    description: "Text-based artistic designs",
    productCount: 4,
    status: "active",
    createdAt: "2024-01-01",
  },
]

const sampleSalesData: SalesData[] = [
  { date: "2024-12-01", revenue: 1250, orders: 18 },
  { date: "2024-12-02", revenue: 980, orders: 14 },
  { date: "2024-12-03", revenue: 1420, orders: 21 },
  { date: "2024-12-04", revenue: 890, orders: 12 },
  { date: "2024-12-05", revenue: 1680, orders: 24 },
  { date: "2024-12-06", revenue: 1120, orders: 16 },
  { date: "2024-12-07", revenue: 1890, orders: 28 },
  { date: "2024-12-08", revenue: 1340, orders: 19 },
  { date: "2024-12-09", revenue: 1560, orders: 22 },
  { date: "2024-12-10", revenue: 2100, orders: 31 },
  { date: "2024-12-11", revenue: 1780, orders: 26 },
  { date: "2024-12-12", revenue: 1450, orders: 20 },
  { date: "2024-12-13", revenue: 1920, orders: 27 },
  { date: "2024-12-14", revenue: 2340, orders: 35 },
]

interface AdminStore {
  admin: AdminUser | null
  customers: Customer[]
  orders: AdminOrder[]
  customOrders: CustomPosterOrder[]
  products: AdminProduct[]
  collections: AdminCollection[]
  categories: AdminCategory[]
  salesData: SalesData[]

  // Admin actions
  updateAdmin: (admin: Partial<AdminUser>) => void

  // Product actions
  addProduct: (product: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, product: Partial<AdminProduct>) => void
  deleteProduct: (id: string) => void

  // Collection actions
  addCollection: (collection: Omit<AdminCollection, "id" | "createdAt">) => void
  updateCollection: (id: string, collection: Partial<AdminCollection>) => void
  deleteCollection: (id: string) => void

  // Category actions
  addCategory: (category: Omit<AdminCategory, "id" | "createdAt">) => void
  updateCategory: (id: string, category: Partial<AdminCategory>) => void
  deleteCategory: (id: string) => void

  // Order actions
  updateOrderStatus: (id: string, status: AdminOrder["status"]) => void
  updateCustomOrderStatus: (id: string, status: CustomPosterOrder["status"]) => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: {
        id: "admin-1",
        name: "Admin User",
        email: "admin@postercraft.com",
        role: "admin",
        joinedDate: "2023-01-01",
      },
      customers: sampleCustomers,
      orders: sampleAdminOrders,
      customOrders: sampleCustomPosterOrders,
      products: sampleProducts,
      collections: sampleCollections,
      categories: sampleCategories,
      salesData: sampleSalesData,

      updateAdmin: (updates) =>
        set((state) => ({
          admin: state.admin ? { ...state.admin, ...updates } : null,
        })),

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: `prod-${Date.now()}`,
              createdAt: new Date().toISOString().split("T")[0],
              updatedAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : p,
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addCollection: (collection) =>
        set((state) => ({
          collections: [
            ...state.collections,
            {
              ...collection,
              id: `col-${Date.now()}`,
              createdAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateCollection: (id, updates) =>
        set((state) => ({
          collections: state.collections.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            {
              ...category,
              id: `cat-${Date.now()}`,
              createdAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      updateCustomOrderStatus: (id, status) =>
        set((state) => ({
          customOrders: state.customOrders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    {
      name: "poster-admin",
    },
  ),
)
