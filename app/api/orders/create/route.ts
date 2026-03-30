import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPrisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const db = getPrisma()

    // Busca o carrinho do usuário
    const cart = await db.cart.findFirst({
      where: { userId: user.sub },
      include: { items: true },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho vazio' },
        { status: 400 }
      )
    }

    // Calcula o total em centavos
    const totalAmountCents = Math.round(
      cart.items.reduce((sum, item) => sum + item.priceRaw * item.quantity, 0) * 100
    )

    // Cria a Order
    const order = await db.order.create({
      data: {
        userId: user.sub,
        totalAmountCents,
        currency: 'BRL',
        status: 'PAID',
        items: {
          create: cart.items.map((item) => ({
            productSlug: item.productSlug,
            productId: item.productId.toString(),
            name: item.name,
            price: item.price,
            priceRaw: item.priceRaw,
            image: item.image,
            quantity: item.quantity,
            size: item.size,
          })),
        },
      },
      include: { items: true },
    })

    // Limpa o carrinho
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        totalAmountCents: order.totalAmountCents,
        status: order.status,
        itemsCount: order.items.length,
      },
    })
  } catch (error) {
    console.error('[Orders API]', error)
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    )
  }
}
