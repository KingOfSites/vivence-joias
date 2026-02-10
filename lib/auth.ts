import { SignJWT, jwtVerify } from 'jose'

const COOKIE_NAME = 'vivence_auth'
const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.JWT_SECRET || 'vivence-joias-secret-mude-em-producao'
)

export interface AuthPayload {
  sub: string
  email: string
  name: string
}

const EXPIRY = '7d'

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    if (!payload.sub || !payload.email || !payload.name) return null
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
    }
  } catch {
    return null
  }
}

export function getAuthCookieName(): string {
  return COOKIE_NAME
}

export function buildAuthCookie(token: string): string {
  const name = getAuthCookieName()
  const maxAge = 60 * 60 * 24 * 7 // 7 dias
  return `${name}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
}

export function clearAuthCookie(): string {
  const name = getAuthCookieName()
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

export async function getCurrentUser(request: Request): Promise<AuthPayload | null> {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  
  const cookieMap = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    if (key && value) {
      acc[key] = decodeURIComponent(value)
    }
    return acc
  }, {} as Record<string, string>)
  
  const token = cookieMap[getAuthCookieName()]
  if (!token) return null
  
  return verifyToken(token)
}
