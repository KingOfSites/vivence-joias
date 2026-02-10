import { Metadata } from 'next'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { getAllProducts } from '@/lib/products'
import styles from './colecoes.module.css'
import ProductsFilterGrid, { ProductCardData } from './products-filter-grid'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Colecoes | Vivence Joias',
  description: 'Explore nossa curadoria exclusiva em Prata 925 e Ouro 18K. Aneis, colares, brincos e pulseiras de alta joalheria.',
}

const categories = ['Todos', 'Ouro 18K', 'Prata 925', 'Aneis', 'Colares', 'Brincos', 'Pulseiras']

export default async function ColecoesPage() {
  const products = await getAllProducts()
  const cards: ProductCardData[] = products.map((product) => ({
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
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.label}>Colecoes</span>
            <h1 className={styles.title}>Todas as Pecas</h1>
            <p className={styles.subtitle}>
              Cada joia conta uma historia unica. Descubra a peca perfeita para eternizar seus momentos.
            </p>
          </div>
        </section>

        <section className={styles.products}>
          <div className={styles.container}>
            <ProductsFilterGrid categories={categories} products={cards} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
