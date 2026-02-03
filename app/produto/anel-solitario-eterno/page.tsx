import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ProductCard, { Product } from '@/components/ProductCard/ProductCard'
import styles from './produto.module.css'

export const metadata: Metadata = {
  title: 'Anel Solitário Eterno | Vivence Jóias',
  description: 'Anel solitário em Ouro 18K com design atemporal. Uma peça que celebra momentos únicos e eterniza sentimentos.',
}

const relatedProducts: Product[] = [
  {
    id: 2,
    name: 'Colar Pérola Lunar',
    price: 'R$ 1.590,00',
    image: '/images/product-2.png',
    category: 'Prata 925',
    href: '/produto/colar-perola-lunar',
  },
  {
    id: 5,
    name: 'Aliança Clássica',
    price: 'R$ 1.990,00',
    image: '/images/product-1.png',
    category: 'Ouro 18K',
    href: '/produto/alianca-classica',
  },
  {
    id: 8,
    name: 'Bracelete Imperial',
    price: 'R$ 4.290,00',
    image: '/images/product-4.png',
    category: 'Ouro 18K',
    href: '/produto/bracelete-imperial',
  },
]

export default function ProdutoPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.separator}>/</span>
            <Link href="/colecoes">Coleções</Link>
            <span className={styles.separator}>/</span>
            <span>Anel Solitário Eterno</span>
          </nav>

          {/* Product Section */}
          <section className={styles.productSection}>
            {/* Image Gallery */}
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                <Image
                  src="/images/product-1.png"
                  alt="Anel Solitário Eterno"
                  fill
                  className={styles.image}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className={styles.shine} />
              </div>
              <div className={styles.thumbnailGrid}>
                <div className={styles.thumbnail}>
                  <Image
                    src="/images/product-1.png"
                    alt="Anel Solitário Eterno - Vista 1"
                    fill
                    className={styles.thumbnailImage}
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </div>
                <div className={styles.thumbnail}>
                  <Image
                    src="/images/product-2.png"
                    alt="Anel Solitário Eterno - Vista 2"
                    fill
                    className={styles.thumbnailImage}
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </div>
                <div className={styles.thumbnail}>
                  <Image
                    src="/images/product-3.png"
                    alt="Anel Solitário Eterno - Vista 3"
                    fill
                    className={styles.thumbnailImage}
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className={styles.productInfo}>
              <span className={styles.category}>Ouro 18K</span>
              <h1 className={styles.title}>Anel Solitário Eterno</h1>
              <p className={styles.price}>R$ 2.890,00</p>
              
              <div className={styles.description}>
                <p>
                  O Anel Solitário Eterno é uma peça que transcende o tempo, 
                  criada para celebrar os momentos mais significativos da vida. 
                  Com design minimalista e elegante, este anel em Ouro 18K 
                  representa a pureza e a durabilidade dos sentimentos verdadeiros.
                </p>
                <p>
                  Cada detalhe foi cuidadosamente pensado para garantir conforto 
                  e beleza atemporal. Uma joia que se torna parte da sua história, 
                  passando de geração em geração.
                </p>
              </div>

              {/* Specifications */}
              <div className={styles.specifications}>
                <h3 className={styles.specsTitle}>Especificações Técnicas</h3>
                <ul className={styles.specsList}>
                  <li>
                    <span className={styles.specLabel}>Material:</span>
                    <span className={styles.specValue}>Ouro 18K (750)</span>
                  </li>
                  <li>
                    <span className={styles.specLabel}>Peso:</span>
                    <span className={styles.specValue}>3,2g</span>
                  </li>
                  <li>
                    <span className={styles.specLabel}>Largura:</span>
                    <span className={styles.specValue}>2,5mm</span>
                  </li>
                  <li>
                    <span className={styles.specLabel}>Acabamento:</span>
                    <span className={styles.specValue}>Polido brilhante</span>
                  </li>
                  <li>
                    <span className={styles.specLabel}>Tamanhos disponíveis:</span>
                    <span className={styles.specValue}>12 a 20 (ajuste gratuito)</span>
                  </li>
                  <li>
                    <span className={styles.specLabel}>Garantia:</span>
                    <span className={styles.specValue}>2 anos contra defeitos de fabricação</span>
                  </li>
                </ul>
              </div>

              {/* Size Selector */}
              <div className={styles.sizeSelector}>
                <label className={styles.sizeLabel}>Tamanho</label>
                <div className={styles.sizeOptions}>
                  {[14, 15, 16, 17, 18, 19].map((size) => (
                    <button key={size} className={styles.sizeButton}>
                      {size}
                    </button>
                  ))}
                </div>
                <p className={styles.sizeHelp}>
                  Não sabe seu tamanho?{' '}
                  <Link href="/atendimento" className={styles.sizeLink}>
                    Entre em contato
                  </Link>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className={styles.actions}>
                <button className={styles.buyButton}>
                  Adicionar ao Carrinho
                </button>
        
              </div>

              {/* Shipping Info */}
              <div className={styles.shippingInfo}>
                <div className={styles.shippingItem}>
                  <span className={styles.shippingIcon}>🚚</span>
                  <div>
                    <p className={styles.shippingTitle}>Frete Grátis</p>
                    <p className={styles.shippingText}>Para compras acima de R$ 1.000,00</p>
                  </div>
                </div>
                <div className={styles.shippingItem}>
                  <span className={styles.shippingIcon}>🔒</span>
                  <div>
                    <p className={styles.shippingTitle}>Compra Segura</p>
                    <p className={styles.shippingText}>Pagamento 100% seguro e protegido</p>
                  </div>
                </div>
                <div className={styles.shippingItem}>
                  <span className={styles.shippingIcon}>↩️</span>
                  <div>
                    <p className={styles.shippingTitle}>Troca Garantida</p>
                    <p className={styles.shippingText}>7 dias para troca ou devolução</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Products */}
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Você também pode gostar</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
