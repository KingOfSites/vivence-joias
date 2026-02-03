'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './FeaturedProducts.module.css'

const products = [
  {
    id: 1,
    name: 'Anel Solitário Eterno',
    price: 'R$ 2.890,00',
    image: '/images/product-1.png',
    category: 'Ouro 18K',
    href: '/produto/anel-solitario-eterno',
  },
  {
    id: 2,
    name: 'Colar Pérola Lunar',
    price: 'R$ 1.590,00',
    image: '/images/product-2.png',
    category: 'Prata 925',
    href: '/produto/colar-perola-lunar',
  },
  {
    id: 3,
    name: 'Brincos Aurora',
    price: 'R$ 890,00',
    image: '/images/product-3.png',
    category: 'Prata 925',
    href: '/produto/brincos-aurora',
  },
  {
    id: 4,
    name: 'Pulseira Corrente Real',
    price: 'R$ 3.490,00',
    image: '/images/product-4.png',
    category: 'Ouro 18K',
    href: '/produto/pulseira-corrente-real',
  },
]

export default function FeaturedProducts() {
  return (
    <section className={styles.featured}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Destaques</span>
          <h2 className={styles.title}>Peças em Destaque</h2>
        </div>

        <div className={styles.grid}>
          {products.map((product) => (
            <Link key={product.id} href={product.href} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className={styles.shine} />
              </div>
              <div className={styles.info}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.name}>{product.name}</h3>
                <span className={styles.price}>{product.price}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.viewAll}>
          <Link href="/colecoes" className={styles.viewAllLink}>
            Ver Todas as Peças
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
