import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPrisma } from '@/lib/prisma'

const CART_COOKIE = 'vivence_cart_id'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const prisma = getPrisma()
    const { itemId } = await params
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(CART_COOKIE)?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'Carrinho não encontrado' }, { status: 404 })
    }

    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    })

    if (!cart || !cart.items.some((i) => i.id === itemId)) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { quantity } = body

    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ error: 'Quantidade inválida' }, { status: 400 })
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })

    const items = cart.items.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    const totalItems = items.reduce((s, i) => s + i.quantity, 0)

    return NextResponse.json({
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
  } catch (error) {
    console.error('[API cart PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const prisma = getPrisma()
    const { itemId } = await params
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(CART_COOKIE)?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'Carrinho não encontrado' }, { status: 404 })
    }

    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    })

    if (!cart || !cart.items.some((i) => i.id === itemId)) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    await prisma.cartItem.delete({ where: { id: itemId } })

    const items = cart.items.filter((i) => i.id !== itemId)
    const totalItems = items.reduce((s, i) => s + i.quantity, 0)

    return NextResponse.json({
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
  } catch (error) {
    console.error('[API cart DELETE]', error)
    return NextResponse.json({ error: 'Erro ao remover item' }, { status: 500 })
  }
}
