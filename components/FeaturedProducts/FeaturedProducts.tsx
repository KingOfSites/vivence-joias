import Link from 'next/link'
import Image from 'next/image'
import styles from './FeaturedProducts.module.css'

interface FeaturedProduct {
  id: number
  name: string
  price: string
  image: string
  category: string
  href: string
}

interface FeaturedProductsProps {
  products: FeaturedProduct[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
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
                  src={product.image || '/placeholder.svg'}
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
