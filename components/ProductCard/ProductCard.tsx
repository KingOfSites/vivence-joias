'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './ProductCard.module.css'

export interface Product {
  id: number
  name: string
  price: string
  image: string
  category: string
  href: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={product.href} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className={styles.shine} />
        <div className={styles.lensFlare} />
      </div>
      <div className={styles.info}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>{product.price}</span>
      </div>
    </Link>
  )
}
