import { Metadata } from 'next'
import Image from 'next/image'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './nossa-historia.module.css'

export const metadata: Metadata = {
  title: 'Nossa História | Vivence Jóias',
  description: 'Conheça a história da Vivence Jóias. Uma tradição familiar de mais de três décadas dedicada à arte da joalheria.',
}

const timeline = [
  {
    year: '1992',
    title: 'O Início',
    description: 'Maria Helena abre sua primeira oficina de joalheria em São Paulo, com foco em peças artesanais personalizadas.',
  },
  {
    year: '2005',
    title: 'Expansão',
    description: 'A marca ganha reconhecimento nacional e inaugura sua primeira loja física em um dos endereços mais prestigiados de São Paulo.',
  },
  {
    year: '2015',
    title: 'Nova Geração',
    description: 'Ana e Rafael, filhos de Maria Helena, assumem a direção criativa, trazendo uma nova visão contemporânea às coleções.',
  },
  {
    year: '2024',
    title: 'Era Digital',
    description: 'Vivence Jóias expande sua presença online, levando a excelência da joalheria brasileira para todo o mundo.',
  },
]

export default function NossaHistoriaPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.label}>Sobre Nós</span>
            <h1 className={styles.title}>Nossa História</h1>
            <p className={styles.subtitle}>
              Uma tradição familiar de mais de três décadas dedicada à arte da joalheria fina.
            </p>
          </div>
        </section>

        <section className={styles.story}>
          <div className={styles.container}>
            <div className={styles.storyGrid}>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <Image
                    src="/images/historia.jpg"
                    alt="Ateliê Vivence Jóias"
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className={styles.textColumn}>
                <h2 className={styles.sectionTitle}>Tradição que Atravessa Gerações</h2>
                <p className={styles.text}>
                  A Vivence Jóias nasceu do sonho de uma artesã apaixonada por transformar metais preciosos 
                  em obras de arte eternamente elegantes. Maria Helena, nossa fundadora, acreditava que 
                  cada joia deveria contar uma história única.
                </p>
                <p className={styles.text}>
                  Ao longo de mais de 30 anos, mantemos viva essa filosofia: cada peça é criada com 
                  dedicação artesanal, utilizando apenas materiais nobres de primeira qualidade. Nosso 
                  compromisso é criar joias que não apenas adornam, mas que se tornam parte da história 
                  de quem as usa.
                </p>
                <p className={styles.text}>
                  Hoje, sob a direção criativa da nova geração, combinamos a tradição da joalheria 
                  clássica com um design contemporâneo e sofisticado, sempre mantendo os valores 
                  que nos definem: excelência, exclusividade e atenção aos detalhes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.values}>
          <div className={styles.container}>
            <h2 className={styles.valuesSectionTitle}>Nossos Valores</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <span className={styles.valueIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </span>
                <h3 className={styles.valueTitle}>Excelência</h3>
                <p className={styles.valueText}>
                  Comprometimento absoluto com a qualidade em cada detalhe, desde a seleção dos materiais 
                  até o acabamento final.
                </p>
              </div>
              <div className={styles.valueCard}>
                <span className={styles.valueIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>
                <h3 className={styles.valueTitle}>Paixão</h3>
                <p className={styles.valueText}>
                  Cada peça é criada com amor e dedicação, refletindo nossa paixão pela arte da joalheria 
                  e pelo fazer manual.
                </p>
              </div>
              <div className={styles.valueCard}>
                <span className={styles.valueIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </span>
                <h3 className={styles.valueTitle}>Autenticidade</h3>
                <p className={styles.valueText}>
                  Trabalhamos apenas com materiais genuínos e certificados, garantindo a autenticidade 
                  de cada peça.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.timeline}>
          <div className={styles.container}>
            <h2 className={styles.timelineTitle}>Nossa Jornada</h2>
            <div className={styles.timelineContainer}>
              {timeline.map((item, index) => (
                <div key={item.year} className={styles.timelineItem}>
                  <div className={styles.timelineLine}>
                    <span className={styles.timelineDot} />
                  </div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineYear}>{item.year}</span>
                    <h3 className={styles.timelineItemTitle}>{item.title}</h3>
                    <p className={styles.timelineText}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
