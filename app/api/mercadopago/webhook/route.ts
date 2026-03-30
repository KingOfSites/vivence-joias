import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Webhook do Mercado Pago para receber notificações de pagamento
 * POST /api/mercadopago/webhook
 *
 * Eventos:
 * - payment.created
 * - payment.updated
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    // Mercado Pago envia eventos com action=payment.created ou payment.updated
    if (action !== 'payment.created' && action !== 'payment.updated') {
      return NextResponse.json({ success: true })
    }

    if (!data?.id) {
      console.warn('[Mercado Pago Webhook] Missing payment ID in webhook')
      return NextResponse.json({ success: true })
    }

    const paymentId = data.id
    const accessToken =
      process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN

    if (!accessToken) {
      console.error('[Mercado Pago Webhook] Access token not configured')
      return NextResponse.json(
        { error: 'Access token not configured' },
        { status: 500 }
      )
    }

    // Busca detalhes do pagamento no Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!mpRes.ok) {
      console.error('[Mercado Pago Webhook] Failed to fetch payment details:', mpRes.status)
      return NextResponse.json({ success: true })
    }

    const payment = await mpRes.json()

    // Só processa pagamentos aprovados
    if (payment.status !== 'approved') {
      console.log(`[Mercado Pago Webhook] Payment ${paymentId} status: ${payment.status}`)
      return NextResponse.json({ success: true })
    }

    // O external_reference deve ser cartId
    const cartId = payment.external_reference
    if (!cartId) {
      console.warn('[Mercado Pago Webhook] Missing external_reference (cartId)')
      return NextResponse.json({ success: true })
    }

    const db = getPrisma()

    // Busca o carrinho e cria a order
    const cart = await db.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    })

    if (!cart || !cart.userId) {
      console.warn('[Mercado Pago Webhook] Cart not found or no userId:', cartId)
      return NextResponse.json({ success: true })
    }

    if (cart.items.length === 0) {
      console.warn('[Mercado Pago Webhook] Cart is empty:', cartId)
      return NextResponse.json({ success: true })
    }

    // Verifica se order já foi criada para este pagamento
    const existingOrder = await db.order.findFirst({
      where: {
        provider: 'MERCADO_PAGO',
        providerOrderId: String(paymentId),
      },
    })

    if (existingOrder) {
      console.log('[Mercado Pago Webhook] Order already created for payment:', paymentId)
      return NextResponse.json({ success: true })
    }

    // Calcula o total em centavos
    const totalAmountCents = Math.round(
      cart.items.reduce((sum, item) => sum + item.priceRaw * item.quantity, 0) * 100
    )

    // Cria a Order com os dados do Mercado Pago
    const order = await db.order.create({
      data: {
        userId: cart.userId,
        totalAmountCents,
        currency: 'BRL',
        status: 'PAID',
        provider: 'MERCADO_PAGO',
        providerOrderId: String(paymentId),
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
      where: { cartId: cartId },
    })

    console.log(`[Mercado Pago Webhook] Order created: ${order.id} for payment: ${paymentId}`)

    return NextResponse.json({
      success: true,
      orderId: order.id,
    })
  } catch (error) {
    console.error('[Mercado Pago Webhook]', error)
    // Retorna 200 mesmo em erro para o Mercado Pago não ficar reenviando
    return NextResponse.json({ success: false })
  }
}
