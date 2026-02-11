import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { signToken, buildAuthCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const CART_COOKIE = 'vivence_cart_id'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body as {
      email?: string
      password?: string
      name?: string
    }

    const emailTrim = email?.trim()?.toLowerCase()
    if (!emailTrim) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório' },
        { status: 400 }
      )
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }
    const nameTrim = name?.trim()
    if (!nameTrim) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const { getPrisma } = await import('@/lib/prisma')
    const prisma = getPrisma()
    const existing = await prisma.user.findUnique({
      where: { email: emailTrim },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado' },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email: emailTrim,
        password: hashed,
        name: nameTrim,
      },
    })

    // Transferir carrinho da sessão para o usuário
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(CART_COOKIE)?.value
    
    if (sessionId) {
      const sessionCart = await prisma.cart.findUnique({
        where: { sessionId },
        include: { items: true },
      })
      
      if (sessionCart && sessionCart.items.length > 0) {
        // Vincular carrinho da sessão ao usuário
        await prisma.cart.update({
          where: { id: sessionCart.id },
          data: { userId: user.id, sessionId: null },
        })
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
    console.error('[auth/register]', e)
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
