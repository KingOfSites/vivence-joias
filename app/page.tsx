import Header from '@/components/Header/Header'
import Hero from '@/components/Hero/Hero'
import Collections from '@/components/Collections/Collections'
import FeaturedProducts from '@/components/FeaturedProducts/FeaturedProducts'
import Newsletter from '@/components/Newsletter/Newsletter'
import Footer from '@/components/Footer/Footer'
import { getFeaturedProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await getFeaturedProducts(4)
  const featured = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    href: `/produto/${product.slug}`,
  }))

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Collections />
        <FeaturedProducts products={featured} />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
