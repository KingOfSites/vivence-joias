import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPrisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const CART_COOKIE = 'vivence_cart_id'

function getOrCreateSessionId(): string {
  return crypto.randomUUID()
}

async function getOrCreateCart(prisma: ReturnType<typeof getPrisma>, userId: string | null, sessionId: string | null) {
  if (userId) {
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    })
    if (cart) return cart
    
    if (sessionId) {
      const sessionCart = await prisma.cart.findUnique({
        where: { sessionId },
        include: { items: true },
      })
      if (sessionCart) {
        cart = await prisma.cart.update({
          where: { id: sessionCart.id },
          data: { userId, sessionId: null },
          include: { items: true },
        })
        return cart
      }
    }
    
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    })
    return cart
  }
  
  if (!sessionId) return null
  
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  })
  
  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: { items: true },
    })
  }
  
  return cart
}

export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma()
    const user = await getCurrentUser(request)
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(CART_COOKIE)?.value || null

    const cart = await getOrCreateCart(prisma, user?.sub || null, sessionId)

    if (!cart) {
      return NextResponse.json({ items: [], totalItems: 0 })
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productSlug: item.productSlug,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      size: item.size,
    }))

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

    return NextResponse.json({ items, totalItems })
  } catch (error) {
    console.error('[API cart GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar carrinho' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma()
    const user = await getCurrentUser(request)
    const cookieStore = await cookies()
    let sessionId = cookieStore.get(CART_COOKIE)?.value || null

    if (!sessionId && !user) {
      sessionId = getOrCreateSessionId()
      cookieStore.set(CART_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      })
    }

    const body = await request.json()
    const { productId, productSlug, name, price, priceRaw, image, quantity = 1, size } = body

    if (!productId || !productSlug || !name || !price || image === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: productId, productSlug, name, price, image' },
        { status: 400 }
      )
    }

    const cart = await getOrCreateCart(prisma, user?.sub || null, sessionId)
    
    if (!cart) {
      return NextResponse.json({ error: 'Erro ao criar carrinho' }, { status: 500 })
    }

    const existingItem = cart.items.find(
      (i) => i.productId === productId && i.size === (size ?? null)
    )

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      })
      const items = cart.items.map((i) =>
        i.id === updated.id ? { ...i, quantity: updated.quantity } : i
      )
      const totalItems = items.reduce((s, i) => s + i.quantity, 0)
      return NextResponse.json({
        item: { id: updated.id, ...updated },
        items: items.map((i) => ({
          id: i.id,
          productId: i.productId,
          productSlug: i.productSlug,
          name: i.name,
          price: i.price,
          image: i.image,
          quantity: i.quantity,
          size: i.size,
        })),
        totalItems,
      })
    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: Number(productId),
        productSlug: String(productSlug),
        name: String(name),
        price: String(price),
        priceRaw: Number(priceRaw) || 0,
        image: String(image),
        quantity: Number(quantity) || 1,
        size: size != null ? Number(size) : null,
      },
    })

    const items = [...cart.items, newItem].map((i) => ({
      id: i.id,
      productId: i.productId,
      productSlug: i.productSlug,
      name: i.name,
      price: i.price,
      image: i.image,
      quantity: i.quantity,
      size: i.size,
    }))
    const totalItems = items.reduce((s, i) => s + i.quantity, 0)

    return NextResponse.json({
      item: newItem,
      items,
      totalItems,
    })
  } catch (error) {
    console.error('[API cart POST]', error)
    return NextResponse.json({ error: 'Erro ao adicionar ao carrinho' }, { status: 500 })
  }
}
