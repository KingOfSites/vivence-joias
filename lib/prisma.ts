import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function parseDatabaseUrl(url: string) {
  const u = new URL(url)
  return {
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: u.username,
    password: u.password,
    database: u.pathname.slice(1).replace(/\/$/, '') || undefined,
  }
}

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const url = process.env.DATABASE_URL
  if (!url || url.trim() === '') {
    throw new Error(
      'DATABASE_URL não está definida. Verifique o arquivo .env na raiz do projeto.'
    )
  }

  const config = parseDatabaseUrl(url.trim())
  const adapter = new PrismaMariaDb(
    {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: 5,
    },
    config.database ? { schema: config.database } : undefined
  )

  const client = new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}
