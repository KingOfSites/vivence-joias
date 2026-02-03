import { Metadata } from 'next'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ProductCard, { Product } from '@/components/ProductCard/ProductCard'
import styles from './colecoes.module.css'

export const metadata: Metadata = {
  title: 'Coleções | Vivence Jóias',
  description: 'Explore nossa curadoria exclusiva em Prata 925 e Ouro 18K. Anéis, colares, brincos e pulseiras de alta joalheria.',
}

const products: Product[] = [
  {
    id: 1,
    name: 'Anel Solitário Eterno',
    price: 'R$ 2.890,00',
    image: '/images/product-1.jpg',
    category: 'Ouro 18K',
    href: '/produto/anel-solitario-eterno',
  },
  {
    id: 2,
    name: 'Colar Pérola Lunar',
    price: 'R$ 1.590,00',
    image: '/images/product-2.jpg',
    category: 'Prata 925',
    href: '/produto/colar-perola-lunar',
  },
  {
    id: 3,
    name: 'Brincos Aurora',
    price: 'R$ 890,00',
    image: '/images/product-3.jpg',
    category: 'Prata 925',
    href: '/produto/brincos-aurora',
  },
  {
    id: 4,
    name: 'Pulseira Corrente Real',
    price: 'R$ 3.490,00',
    image: '/images/product-4.jpg',
    category: 'Ouro 18K',
    href: '/produto/pulseira-corrente-real',
  },
  {
    id: 5,
    name: 'Aliança Clássica',
    price: 'R$ 1.990,00',
    image: '/images/product-1.jpg',
    category: 'Ouro 18K',
    href: '/produto/alianca-classica',
  },
  {
    id: 6,
    name: 'Pingente Coração',
    price: 'R$ 790,00',
    image: '/images/product-2.jpg',
    category: 'Prata 925',
    href: '/produto/pingente-coracao',
  },
  {
    id: 7,
    name: 'Argolas Minimalistas',
    price: 'R$ 590,00',
    image: '/images/product-3.jpg',
    category: 'Prata 925',
    href: '/produto/argolas-minimalistas',
  },
  {
    id: 8,
    name: 'Bracelete Imperial',
    price: 'R$ 4.290,00',
    image: '/images/product-4.jpg',
    category: 'Ouro 18K',
    href: '/produto/bracelete-imperial',
  },
]

const categories = ['Todos', 'Ouro 18K', 'Prata 925', 'Anéis', 'Colares', 'Brincos', 'Pulseiras']

export default function ColecoesPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.label}>Coleções</span>
            <h1 className={styles.title}>Todas as Peças</h1>
            <p className={styles.subtitle}>
              Cada joia conta uma história única. Descubra a peça perfeita para eternizar seus momentos.
            </p>
          </div>
        </section>

        <section className={styles.products}>
          <div className={styles.container}>
            <div className={styles.filters}>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.filterButton} ${category === 'Todos' ? styles.active : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
