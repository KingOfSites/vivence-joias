import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { signToken, buildAuthCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const CART_COOKIE = 'vivence_cart_id'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body as { email?: string; password?: string }

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const { getPrisma } = await import('@/lib/prisma')
    const prisma = getPrisma()
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos' },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos' },
        { status: 401 }
      )
    }

    // Transferir carrinho da sessão para o usuário
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(CART_COOKIE)?.value
    
    if (sessionId) {
      const sessionCart = await prisma.cart.findUnique({
        where: { sessionId },
        include: { items: true },
      })
      
      if (sessionCart && sessionCart.items.length > 0) {
        const userCart = await prisma.cart.findFirst({
          where: { userId: user.id },
          include: { items: true },
        })
        
        if (userCart) {
          // Mesclar itens: se já existe o mesmo produto+tamanho, soma quantidade; senão adiciona
          for (const sessionItem of sessionCart.items) {
            const existing = userCart.items.find(
              (i) => i.productId === sessionItem.productId && i.size === sessionItem.size
            )
            if (existing) {
              await prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + sessionItem.quantity },
              })
            } else {
              await prisma.cartItem.create({
                data: {
                  cartId: userCart.id,
                  productId: sessionItem.productId,
                  productSlug: sessionItem.productSlug,
                  name: sessionItem.name,
                  price: sessionItem.price,
                  priceRaw: sessionItem.priceRaw,
                  image: sessionItem.image,
                  quantity: sessionItem.quantity,
                  size: sessionItem.size,
                },
              })
            }
          }
          // Deletar carrinho da sessão após transferir
          await prisma.cart.delete({ where: { id: sessionCart.id } })
        } else {
          // Vincular carrinho da sessão ao usuário
          await prisma.cart.update({
            where: { id: sessionCart.id },
            data: { userId: user.id, sessionId: null },
          })
        }
      }
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    })

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    })
    res.headers.set('Set-Cookie', buildAuthCookie(token))
    return res
  } catch (e) {
    console.error('[auth/login]', e)
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
