'use client'

import Link from 'next/link'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundOverlay} />
      <div className={styles.sparkles}>
        <span className={styles.sparkle} style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
        <span className={styles.sparkle} style={{ top: '40%', left: '85%', animationDelay: '1.5s' }} />
        <span className={styles.sparkle} style={{ top: '70%', left: '25%', animationDelay: '3s' }} />
        <span className={styles.sparkle} style={{ top: '30%', left: '70%', animationDelay: '4.5s' }} />
      </div>
      
      <div className={styles.content}>
        <h1 className={styles.headline}>
          A eternidade moldada em metais nobres.
        </h1>
        <p className={styles.subheadline}>
          Explore nossa curadoria exclusiva em Prata 925 e Ouro 18K.
          <br />
          Design que conta histórias, qualidade que atravessa gerações.
        </p>
        <Link href="/colecoes" className={styles.cta}>
          <span className={styles.ctaText}>Explorar Coleções</span>
          <span className={styles.ctaShine} />
        </Link>
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  )
}
