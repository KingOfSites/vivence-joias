import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

/**
 * Webhook do Mercado Pago para receber notificações de pagamento
 * POST /api/mercadopago/webhook
 *
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/notifications/webhooks
 *
 * O Mercado Pago envia:
 * - Query params: ?data.id=123456&type=payment
 * - Body: { action, api_version, data: { id }, type, ... }
 * - Header x-signature: ts=...,v1=... (HMAC-SHA256 com a chave secreta)
 */

// GET: endpoint de validação solicitado pelo Mercado Pago ao salvar a URL no painel
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}

export async function POST(request: NextRequest) {
  try {
    // Lê o body como texto para validação de assinatura
    const rawBody = await request.text()
    let body: Record<string, unknown> = {}
    try {
      body = JSON.parse(rawBody)
    } catch {
      // body não é JSON (pode ser form-encoded em notificações antigas)
    }

    // Valida assinatura x-signature se a chave secreta estiver configurada
    const webhookSecret = process.env.MP_WEBHOOK_SECRET
    if (webhookSecret) {
      const xSignature = request.headers.get('x-signature')
      const xRequestId = request.headers.get('x-request-id')
      const dataId = request.nextUrl.searchParams.get('data.id')

      if (xSignature) {
        const isValid = validateSignature({
          xSignature,
          xRequestId,
          dataId,
          ts: '',
          secret: webhookSecret,
        })

        if (!isValid) {
          console.warn('[Mercado Pago Webhook] Assinatura inválida')
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }
      }
    }

    const { action, data, type } = body as {
      action?: string
      data?: { id?: string | number }
      type?: string
    }

    // Suporte ao formato antigo (query param topic=payment&id=X) e novo (data.id=X&type=payment)
    const queryDataId = request.nextUrl.searchParams.get('data.id')
    const queryId = request.nextUrl.searchParams.get('id')
    const queryTopic = request.nextUrl.searchParams.get('topic')
    const queryType = request.nextUrl.searchParams.get('type')

    const topic = queryTopic || queryType || type
    const paymentId = data?.id || queryDataId || queryId

    // Aceita notificações de pagamento (formato novo com action ou formato antigo com topic)
    const isPaymentEvent =
      (action === 'payment.created' || action === 'payment.updated') ||
      topic === 'payment'

    if (!isPaymentEvent) {
      console.log(`[Mercado Pago Webhook] Evento ignorado: action=${action}, topic=${topic}`)
      return NextResponse.json({ success: true })
    }

    if (!paymentId) {
      console.warn('[Mercado Pago Webhook] ID do pagamento não encontrado na notificação')
      return NextResponse.json({ success: true })
    }

    const accessToken =
      process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN

    if (!accessToken) {
      console.error('[Mercado Pago Webhook] Access token não configurado')
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
      console.error('[Mercado Pago Webhook] Falha ao buscar pagamento:', mpRes.status)
      return NextResponse.json({ success: true })
    }

    const payment = await mpRes.json()

    // Só processa pagamentos aprovados
    if (payment.status !== 'approved') {
      console.log(`[Mercado Pago Webhook] Pagamento ${paymentId} status: ${payment.status}`)
      return NextResponse.json({ success: true })
    }

    // O external_reference deve ser cartId
    const cartId = payment.external_reference
    if (!cartId) {
      console.warn('[Mercado Pago Webhook] external_reference ausente no pagamento')
      return NextResponse.json({ success: true })
    }

    const db = getPrisma()

    // Verifica se order já foi criada para este pagamento (idempotência)
    const existingOrder = await db.order.findFirst({
      where: {
        provider: 'MERCADO_PAGO',
        providerOrderId: String(paymentId),
      },
    })

    if (existingOrder) {
      console.log('[Mercado Pago Webhook] Order já criada para pagamento:', paymentId)
      return NextResponse.json({ success: true })
    }

    // Busca o carrinho e seus itens
    const cart = await db.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    })

    // Resolve productId (String, FK para Product.id) a partir do slug
    const slugs = cart?.items.map((i) => i.productSlug) ?? []
    const products = slugs.length
      ? await db.product.findMany({
          where: { slug: { in: slugs } },
          select: { id: true, slug: true },
        })
      : []
    const slugToId = Object.fromEntries(products.map((p) => [p.slug, p.id]))

    if (!cart || !cart.userId) {
      console.warn('[Mercado Pago Webhook] Carrinho não encontrado:', cartId)
      return NextResponse.json({ success: true })
    }

    if (cart.items.length === 0) {
      console.warn('[Mercado Pago Webhook] Carrinho vazio:', cartId)
      return NextResponse.json({ success: true })
    }

    // Calcula o total em centavos
    const totalAmountCents = Math.round(
      cart.items.reduce((sum, item) => sum + item.priceRaw * item.quantity, 0) * 100
    )

    // Cria a Order
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
            productId: slugToId[item.productSlug] ?? null,
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
    await db.cartItem.deleteMany({ where: { cartId } })

    console.log(`[Mercado Pago Webhook] Order criada: ${order.id} | Pagamento: ${paymentId}`)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('[Mercado Pago Webhook]', error)
    // Retorna 200 para o MP não reenviar indefinidamente
    return NextResponse.json({ success: false })
  }
}

/**
 * Valida a assinatura HMAC-SHA256 enviada pelo Mercado Pago no header x-signature.
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/notifications/webhooks
 */
function validateSignature({
  xSignature,
  xRequestId,
  dataId,
  secret,
}: {
  xSignature: string
  xRequestId: string | null
  dataId: string | null
  ts: string
  secret: string
}): boolean {
  try {
    const parts = xSignature.split(',')
    let ts = ''
    let v1 = ''

    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key?.trim() === 'ts') ts = value?.trim() ?? ''
      if (key?.trim() === 'v1') v1 = value?.trim() ?? ''
    }

    if (!ts || !v1) return false

    // Template: id:[data.id];request-id:[x-request-id];ts:[ts];
    const template = `id:${dataId ?? ''};request-id:${xRequestId ?? ''};ts:${ts};`

    const computed = crypto
      .createHmac('sha256', secret)
      .update(template)
      .digest('hex')

    return computed === v1
  } catch {
    return false
  }
}
