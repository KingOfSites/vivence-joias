import { Metadata } from 'next'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ProductCard from '@/components/ProductCard/ProductCard'
import { getProductsByCollectionSlug } from '@/lib/products'
import styles from '../colecoes.module.css'

interface PageProps {
  params: Promise<{ slug: string }>
}

const slugToTitle: Record<string, string> = {
  'ouro-18k': 'Ouro 18K',
  'prata-925': 'Prata 925',
  'aneis': 'Anéis',
  'colares': 'Colares',
  'brincos': 'Brincos',
  'pulseiras': 'Pulseiras',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const title = slugToTitle[slug.toLowerCase()] ?? slug
  return {
    title: `${title} | Coleções | Vivence Jóias`,
    description: `Explore nossa coleção ${title}. Joalheria premium em Prata 925 e Ouro 18K.`,
  }
}

export default async function ColecaoSlugPage({ params }: PageProps) {
  const { slug } = await params
  const products = getProductsByCollectionSlug(slug)
  const title = slugToTitle[slug.toLowerCase()] ?? slug

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.label}>Coleção</span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>
              Peças selecionadas para você. Qualidade e design que atravessam gerações.
            </p>
          </div>
        </section>

        <section className={styles.products}>
          <div className={styles.container}>
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    href: `/produto/${product.slug}`,
                  }}
                />
              ))}
            </div>
            {products.length === 0 && (
              <p className={styles.subtitle} style={{ textAlign: 'center', padding: '2rem' }}>
                Nenhuma peça encontrada nesta coleção no momento.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
