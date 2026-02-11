import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { clearAuthCookie, getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const CART_COOKIE = 'vivence_cart_id'

function getOrCreateSessionId(): string {
  return crypto.randomUUID()
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    const cookieStore = await cookies()
    let sessionId = cookieStore.get(CART_COOKIE)?.value

    // Se havia um usuário logado, garantir que há um sessionId para criar novo carrinho
    if (user && !sessionId) {
      sessionId = getOrCreateSessionId()
      cookieStore.set(CART_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      })
    }

    // Criar um novo carrinho vazio para a sessão (se houver sessionId)
    if (sessionId && process.env.DATABASE_URL) {
      const { getPrisma } = await import('@/lib/prisma')
      const prisma = getPrisma()
      // Verificar se já existe um carrinho para esta sessão
      const existingCart = await prisma.cart.findUnique({
        where: { sessionId },
      })
      if (!existingCart) {
        // Criar novo carrinho vazio para a sessão
        await prisma.cart.create({
          data: { sessionId },
        })
      }
    }

    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', clearAuthCookie())
    return res
  } catch (e) {
    console.error('[auth/logout]', e)
    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', clearAuthCookie())
    return res
  }
}
