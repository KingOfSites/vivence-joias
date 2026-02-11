import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const slug = String(body.slug || '').trim()
    const description = body.description ? String(body.description) : null
    const collection = body.collection ? String(body.collection) : null
    const material = body.material ? String(body.material) : null
    const mainImage = body.mainImage ? String(body.mainImage) : null
    const sizes = Array.isArray(body.sizes) ? body.sizes : []
    const priceNumber = body.price != null ? Number(body.price) : null

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 })
    }

    const [{ getPrisma }, { Prisma }] = await Promise.all([
      import('@/lib/prisma'),
      import('@prisma/client'),
    ])
    const prisma = getPrisma()
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        status: 'ACTIVE',
        price: priceNumber != null ? new Prisma.Decimal(priceNumber) : null,
        priceRaw: priceNumber != null ? priceNumber : null,
        mainImage,
        gallery: mainImage ? [mainImage] : [],
        sizes,
        material,
        collection,
      },
    })

    return NextResponse.json({ id: product.id })
  } catch (error) {
    console.error('[API admin products POST]', error)
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 })
  }
}
