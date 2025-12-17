"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type Product, allProducts } from "./products"

export interface Order {
  id: string
  date: string
  status: "processing" | "shipped" | "delivered" | "cancelled"
  items: {
    productId: string
    title: string
    image: string
    size: string
    quantity: number
    price: number
  }[]
  total: number
  shippingAddress: Address
}

export interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
}

interface UserStore {
  isLoggedIn: boolean
  profile: UserProfile | null
  wishlist: string[]
  addresses: Address[]
  orders: Order[]
  login: (profile: UserProfile) => void
  logout: () => void
  updateProfile: (profile: Partial<UserProfile>) => void
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  getWishlistProducts: () => Product[]
  addAddress: (address: Omit<Address, "id">) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
}

// Sample orders for demo
const sampleOrders: Order[] = [
  {
    id: "ORD-2024-001",
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
      {
        productId: "2",
        title: "Abstract Flow",
        image: "/abstract-fluid-black-white-poster-art.jpg",
        size: "A2 (42×59cm)",
        quantity: 1,
        price: 89,
      },
    ],
    total: 138,
    shippingAddress: {
      id: "1",
      label: "Home",
      firstName: "John",
      lastName: "Doe",
      street: "123 Art Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
  },
  {
    id: "ORD-2024-002",
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
      id: "1",
      label: "Home",
      firstName: "John",
      lastName: "Doe",
      street: "123 Art Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
  },
]

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: true, // Set to true for demo
      profile: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
      },
      wishlist: ["3", "7", "10"],
      addresses: [
        {
          id: "1",
          label: "Home",
          firstName: "John",
          lastName: "Doe",
          street: "123 Art Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
          phone: "+1 (555) 123-4567",
          isDefault: true,
        },
        {
          id: "2",
          label: "Office",
          firstName: "John",
          lastName: "Doe",
          street: "456 Business Ave",
          city: "New York",
          state: "NY",
          zipCode: "10002",
          country: "United States",
          phone: "+1 (555) 987-6543",
          isDefault: false,
        },
      ],
      orders: sampleOrders,

      login: (profile) => set({ isLoggedIn: true, profile }),
      logout: () => set({ isLoggedIn: false, profile: null }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      addToWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId) ? state.wishlist : [...state.wishlist, productId],
        })),

      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        })),

      isInWishlist: (productId) => get().wishlist.includes(productId),

      getWishlistProducts: () => {
        const wishlistIds = get().wishlist
        return allProducts.filter((p) => wishlistIds.includes(p.id))
      },

      addAddress: (address) =>
        set((state) => ({
          addresses: [
            ...state.addresses.map((a) => (address.isDefault ? { ...a, isDefault: false } : a)),
            { ...address, id: `addr-${Date.now()}` },
          ],
        })),

      updateAddress: (id, updates) =>
        set((state) => ({
          addresses: state.addresses.map((a) => {
            if (a.id === id) return { ...a, ...updates }
            if (updates.isDefault) return { ...a, isDefault: false }
            return a
          }),
        })),

      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),

      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),
    }),
    {
      name: "poster-user",
    },
  ),
)
