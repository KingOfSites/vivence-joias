'use client'

import { useMemo, useState } from 'react'
import ProductCard, { Product } from '@/components/ProductCard/ProductCard'
import styles from './colecoes.module.css'

export interface ProductCardData extends Product {}

interface ProductsFilterGridProps {
  categories: string[]
  products: ProductCardData[]
}

function normalize(value: string) {
  return value.toLowerCase().trim()
}

function matchesCategory(product: ProductCardData, category: string) {
  const cat = normalize(category)
  if (cat === 'todos') return true

  const name = normalize(product.name)
  const slug = normalize(product.href)
  const productCategory = normalize(product.category)

  if (cat === 'ouro 18k') return productCategory.includes('ouro 18k')
  if (cat === 'prata 925') return productCategory.includes('prata 925')
  if (cat === 'aneis') return slug.includes('anel') || name.includes('anel')
  if (cat === 'colares') return slug.includes('colar') || name.includes('colar')
  if (cat === 'brincos') return slug.includes('brinco') || name.includes('brinco')
  if (cat === 'pulseiras') return slug.includes('pulseira') || name.includes('pulseira')

  return productCategory.includes(cat) || name.includes(cat) || slug.includes(cat)
}

export default function ProductsFilterGrid({ categories, products }: ProductsFilterGridProps) {
  const [active, setActive] = useState(categories[0] ?? 'Todos')

  const filtered = useMemo(() => {
    return products.filter((product) => matchesCategory(product, active))
  }, [products, active])

  return (
    <>
      <div className={styles.filters}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.filterButton} ${category === active ? styles.active : ''}`}
            onClick={() => setActive(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
