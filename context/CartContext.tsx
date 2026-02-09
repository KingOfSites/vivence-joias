'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export interface CartItem {
  id: string
  productId: number
  productSlug: string
  name: string
  price: string
  image: string
  quantity: number
  size: number | null
}

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  loading: boolean
  addItem: (payload: {
    productId: number
    productSlug: string
    name: string
    price: string
    priceRaw: number
    image: string
    quantity: number
    size?: number | null
  }) => Promise<boolean>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart')
      if (!res.ok) return
      const data = await res.json()
      setItems(data.items ?? [])
      setTotalItems(data.totalItems ?? 0)
    } catch {
      setItems([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addItem = useCallback<
    CartContextValue['addItem']
  >(async (payload) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: payload.productId,
          productSlug: payload.productSlug,
          name: payload.name,
          price: payload.price,
          priceRaw: payload.priceRaw,
          image: payload.image,
          quantity: payload.quantity,
          size: payload.size ?? null,
        }),
      })
      if (!res.ok) return false
      const data = await res.json()
      setItems(data.items ?? [])
      setTotalItems(data.totalItems ?? 0)
      return true
    } catch {
      return false
    }
  }, [])

  const removeItem = useCallback(async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
      if (!res.ok) return
      const data = await res.json()
      setItems(data.items ?? [])
      setTotalItems(data.totalItems ?? 0)
    } catch {
      // ignore
    }
  }, [])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      if (!res.ok) return
      const data = await res.json()
      setItems(data.items ?? [])
      setTotalItems(data.totalItems ?? 0)
    } catch {
      // ignore
    }
  }, [])

  const value: CartContextValue = {
    items,
    totalItems,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    refreshCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
