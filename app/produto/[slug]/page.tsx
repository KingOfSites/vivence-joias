import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ProductCard from '@/components/ProductCard/ProductCard'
import ProductPurchase from '@/components/ProductPurchase/ProductPurchase'
import {
  getProductBySlug,
  getAllProductSlugs,
  getRelatedProducts,
  type ProductDetail,
} from '@/lib/products'
import styles from '../produto.module.css'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Produto | Vivence Jóias' }
  return {
    title: `${product.name} | Vivence Jóias`,
    description: product.description[0] ?? `Compre ${product.name} - ${product.price}`,
  }
}

function toProductCard(p: ProductDetail) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    href: `/produto/${p.slug}`,
  }
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const related = getRelatedProducts(slug, 3)

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.separator}>/</span>
            <Link href="/colecoes">Coleções</Link>
            <span className={styles.separator}>/</span>
            <span>{product.name}</span>
          </nav>

          <section className={styles.productSection}>
            <ProductPurchase product={product} styles={styles} />
          </section>

          {related.length > 0 && (
            <section className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>Você também pode gostar</h2>
              <div className={styles.relatedGrid}>
                {related.map((p) => (
                  <ProductCard key={p.id} product={toProductCard(p)} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
