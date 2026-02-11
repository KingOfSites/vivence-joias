import type { Prisma } from '@prisma/client'

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductDetail {
  id: number
  slug: string
  name: string
  price: string
  priceRaw: number
  image: string
  img: string
  mainImage: string
  gallery?: string[]
  category: string
  description: string[]
  specifications: ProductSpec[]
  sizes: number[]
}

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type ProductWithCategories = Prisma.ProductGetPayload<{
  include: { categories: { include: { category: true } } }
}>

function stableIdFromSlug(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash << 5) - hash + slug.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) || 1
}

function normalizeNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'number' ? item : Number(item)))
    .filter((item) => Number.isFinite(item))
}

function normalizeSpecArray(value: unknown): ProductSpec[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const spec = item as { label?: unknown; value?: unknown }
      if (typeof spec.label !== 'string' || typeof spec.value !== 'string') return null
      return { label: spec.label, value: spec.value }
    })
    .filter((item): item is ProductSpec => item !== null)
}

function collectImageStrings(value: unknown): string[] {
  const result: string[] = []

  const push = (item: unknown) => {
    if (typeof item === 'string') {
      const trimmed = item.trim()
      if (trimmed) result.push(trimmed)
    }
  }

  if (typeof value === 'string') {
    push(value)
    return result
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      result.push(...collectImageStrings(item))
    })
    return result
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    ;['image', 'mainImage', 'thumbnail', 'thumb', 'url', 'src', 'cover'].forEach((key) => {
      push(obj[key])
    })
    result.push(...collectImageStrings(obj.images))
    result.push(...collectImageStrings(obj.gallery))
  }

  return result
}

function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  values.forEach((value) => {
    if (seen.has(value)) return
    seen.add(value)
    out.push(value)
  })
  return out
}

function splitDescription(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split(/\r?\n\r?\n|\r?\n/g)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk !== '')
}

function formatPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return 'Sob consulta'
  return priceFormatter.format(value)
}

function toProductDetail(product: ProductWithCategories): ProductDetail {
  const gallery = dedupeStrings(
    collectImageStrings([product.mainImage, product.gallery, product.metadata])
  )
  const image = gallery[0] || '/placeholder.svg'
  const priceFromDecimal = product.price ? Number(product.price) : null
  const priceRaw = product.priceRaw ?? priceFromDecimal ?? 0
  const specifications = normalizeSpecArray(product.specifications)
  const sizeOptions = normalizeNumberArray(product.sizes)
  const ringHint = `${product.slug} ${product.name} ${product.collection ?? ''} ${product.material ?? ''}`.toLowerCase()
  const shouldDefaultSizes = sizeOptions.length === 0 && (ringHint.includes('anel') || ringHint.includes('aneis'))
  const resolvedSizes = shouldDefaultSizes
    ? [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    : sizeOptions
  const category =
    product.categories?.[0]?.category?.name ||
    product.collection ||
    product.material ||
    'Sem categoria'

  const fallbackSpecs: ProductSpec[] = []
  if (!specifications.length) {
    if (product.material) fallbackSpecs.push({ label: 'Material', value: product.material })
    if (product.weight) fallbackSpecs.push({ label: 'Peso', value: product.weight })
  }

  return {
    id: stableIdFromSlug(product.slug),
    slug: product.slug,
    name: product.name,
    price: formatPrice(priceRaw),
    priceRaw,
    image,
    img: image,
    mainImage: image,
    gallery: gallery.length ? gallery : [image],
    category,
    description: splitDescription(product.description),
    specifications: specifications.length ? specifications : fallbackSpecs,
    sizes: resolvedSizes,
  }
}

async function listProducts(where?: Prisma.ProductWhereInput, limit?: number) {
  if (!process.env.DATABASE_URL) return []
  const { getPrisma } = await import('./prisma')
  const prisma = getPrisma()
  return prisma.product.findMany({
    where: { status: 'ACTIVE', ...where },
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getAllProducts(): Promise<ProductDetail[]> {
  const products = await listProducts()
  return products.map(toProductDetail)
}

export async function getFeaturedProducts(limit = 4): Promise<ProductDetail[]> {
  const products = await listProducts(undefined, limit)
  return products.map(toProductDetail)
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | undefined> {
  if (!process.env.DATABASE_URL) return undefined
  const { getPrisma } = await import('./prisma')
  const prisma = getPrisma()
  const product = await prisma.product.findFirst({
    where: { slug, status: 'ACTIVE' },
    include: { categories: { include: { category: true } } },
  })
  if (!product) return undefined
  return toProductDetail(product)
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!process.env.DATABASE_URL) return []
  const { getPrisma } = await import('./prisma')
  const prisma = getPrisma()
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    select: { slug: true },
    orderBy: { createdAt: 'desc' },
  })
  return products.map((p) => p.slug)
}

export async function getRelatedProducts(currentSlug: string, limit = 3): Promise<ProductDetail[]> {
  if (!process.env.DATABASE_URL) return []
  const { getPrisma } = await import('./prisma')
  const prisma = getPrisma()
  const current = await prisma.product.findFirst({
    where: { slug: currentSlug, status: 'ACTIVE' },
    include: { categories: { include: { category: true } } },
  })
  if (!current) return []

  const categoryIds = current.categories.map((c) => c.categoryId)
  const related = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      slug: { not: currentSlug },
      OR: [
        categoryIds.length ? { categories: { some: { categoryId: { in: categoryIds } } } } : undefined,
        current.collection ? { collection: current.collection } : undefined,
      ].filter(Boolean) as Prisma.ProductWhereInput[],
    },
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  if (related.length >= limit) {
    return related.map(toProductDetail)
  }

  const fill = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      slug: { notIn: [currentSlug, ...related.map((p) => p.slug)] },
    },
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit - related.length,
  })

  return [...related, ...fill].map(toProductDetail)
}

export async function getProductsByCategory(category: string): Promise<ProductDetail[]> {
  const normalized = category.toLowerCase()
  const products = await listProducts({
    OR: [
      { categories: { some: { category: { slug: normalized } } } },
      { categories: { some: { category: { name: { contains: normalized } } } } },
      { collection: { contains: normalized } },
      { material: { contains: normalized } },
      { slug: { contains: normalized } },
    ],
  })
  return products.map(toProductDetail)
}

export async function getProductsByCollectionSlug(slug: string): Promise<ProductDetail[]> {
  const s = slug.toLowerCase()
  const keywordMap: Record<string, string> = {
    aneis: 'anel',
    colares: 'colar',
    brincos: 'brinco',
    pulseiras: 'pulseira',
  }
  const keyword = keywordMap[s]
  const where: Prisma.ProductWhereInput = keyword
    ? {
        OR: [
          { slug: { contains: keyword } },
          { name: { contains: keyword } },
          { categories: { some: { category: { slug: s } } } },
        ],
      }
    : {
        OR: [
          { categories: { some: { category: { slug: s } } } },
          { categories: { some: { category: { name: { contains: s } } } } },
          { collection: { contains: s } },
          { material: { contains: s } },
        ],
      }

  const products = await listProducts(where)
  return products.map(toProductDetail)
}
