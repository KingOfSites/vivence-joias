'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Collections.module.css'

const collections = [
  {
    id: 'prata-925',
    title: 'Prata 925',
    description: 'Elegância atemporal em prata de lei',
    image: '/images/prata-925.png',
    hoverImage: '/images/prata-925-model.png',
    href: '/colecoes/prata-925',
  },
  {
    id: 'ouro-18k',
    title: 'Ouro 18K',
    description: 'O brilho eterno do ouro nobre',
    image: '/images/ouro-18k.png',
    hoverImage: '/images/ouro-18k-model.png',
    href: '/colecoes/ouro-18k',
  },
]

export default function Collections() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className={styles.collections}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Nossas Coleções</span>
          <h2 className={styles.title}>Coleções Exclusivas</h2>
          <p className={styles.subtitle}>
            Descubra peças únicas, cuidadosamente selecionadas para eternizar seus momentos mais preciosos.
          </p>
        </div>

        <div className={styles.grid}>
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={collection.href}
              className={styles.card}
              onMouseEnter={() => setHoveredId(collection.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  fill
                  className={`${styles.image} ${hoveredId === collection.id ? styles.hidden : ''}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <Image
                  src={collection.hoverImage || "/placeholder.svg"}
                  alt={`${collection.title} - modelo`}
                  fill
                  className={`${styles.image} ${styles.hoverImage} ${hoveredId === collection.id ? styles.visible : ''}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className={styles.overlay} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{collection.title}</h3>
                <p className={styles.cardDescription}>{collection.description}</p>
                <span className={styles.cardLink}>
                  Explorar
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
