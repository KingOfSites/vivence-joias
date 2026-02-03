import Header from '@/components/Header/Header'
import Hero from '@/components/Hero/Hero'
import Collections from '@/components/Collections/Collections'
import FeaturedProducts from '@/components/FeaturedProducts/FeaturedProducts'
import Newsletter from '@/components/Newsletter/Newsletter'
import Footer from '@/components/Footer/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Collections />
        <FeaturedProducts />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
