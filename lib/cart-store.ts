"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type Product, allProducts } from "./products"

export interface CartItem {
  productId: string
  size: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (productId: string, size: string, price: number, quantity?: number) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  getItemDetails: (item: CartItem) => (Product & { size: string; quantity: number; itemPrice: number }) | null
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, size, price, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === productId && item.size === size)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === productId && item.size === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            }
          }

          return {
            items: [...state.items, { productId, size, price, quantity }],
          }
        })
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.productId === productId && item.size === size)),
        }))
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, size)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size ? { ...item, quantity } : item,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },

      getItemDetails: (item) => {
        const product = allProducts.find((p) => p.id === item.productId)
        if (!product) return null
        return {
          ...product,
          size: item.size,
          quantity: item.quantity,
          itemPrice: item.price,
        }
      },
    }),
    {
      name: "poster-cart",
    },
  ),
)
