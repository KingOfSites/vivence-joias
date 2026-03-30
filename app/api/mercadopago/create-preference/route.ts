import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPrisma } from '@/lib/prisma'

/**
 * Cria uma preferência de pagamento no Mercado Pago (Checkout Pro).
 * Requer MERCADOPAGO_ACCESS_TOKEN no .env
 * Body: { items: Array<{ id, title, quantity, unit_price }> }
 * unit_price em reais (ex: 89.90 para R$ 89,90)
 */
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
	const user = await getCurrentUser(request)
	if (!user) {
		return NextResponse.json(
			{ error: 'Usuário não autenticado' },
			{ status: 401 }
		)
	}

	const accessToken =
		process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN
	if (!accessToken) {
		return NextResponse.json(
			{ error: 'Token do Mercado Pago não configurado. Adicione MP_ACCESS_TOKEN ou MERCADOPAGO_ACCESS_TOKEN no .env' },
      { status: 500 }
		)
	}

	try {
		const db = getPrisma()

		// Busca o carrinho do usuário
		const cart = await db.cart.findFirst({
			where: { userId: user.sub },
		})

		if (!cart) {
			return NextResponse.json(
				{ error: 'Carrinho não encontrado' },
				{ status: 404 }
			)
		}

		const body = await request.json()
		const { items } = body as {
			items: Array<{
				id: string
				title: string
				quantity: number
				unit_price: number
				picture_url?: string
			}>
		}

		if (!items?.length) {
			return NextResponse.json(
				{ error: 'Envie pelo menos um item no array items' },
				{ status: 400 }
			)
		}

		const baseUrl =
			process.env.NEXT_PUBLIC_APP_URL ||
			process.env.VERCEL_URL ||
			'http://localhost:3000'
		const protocol = baseUrl.startsWith('http') ? '' : 'https://'
		const origin = (
			baseUrl.startsWith('http') ? baseUrl : `${protocol}${baseUrl}`
		).replace(/\/$/, '')

		const preferencePayload = {
			items: items.map((item) => ({
				id: item.id || item.title?.slice(0, 256),
				title: item.title?.slice(0, 256) || 'Produto',
				quantity: Number(item.quantity) || 1,
				unit_price: Number(item.unit_price),
				currency_id: 'BRL',
				...(item.picture_url && { picture_url: item.picture_url }),
			})),
			external_reference: cart.id,
			back_urls: {
				success: `${origin}/carrinho/obrigado?status=approved`,
				failure: `${origin}/carrinho/obrigado?status=rejected`,
				pending: `${origin}/carrinho/obrigado?status=pending`,
			},
			auto_return: origin.startsWith('https') ? 'approved' : undefined,
			notification_url: `${origin}/api/mercadopago/webhook`,
		}

		const res = await fetch(
			'https://api.mercadopago.com/checkout/preferences',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(preferencePayload),
			}
		)

		const data = await res.json()

		if (!res.ok) {
			console.error('[Mercado Pago] Erro ao criar preferência:', data)
			return NextResponse.json(
				{ error: data.message || 'Erro ao criar preferência de pagamento' },
				{ status: res.status }
			)
		}

		return NextResponse.json({
			preferenceId: data.id,
			initPoint: data.init_point,
		})
	} catch (error) {
		console.error('[Mercado Pago]', error)
		return NextResponse.json(
			{ error: 'Erro ao processar pagamento' },
			{ status: 500 }
		)
	}
}
