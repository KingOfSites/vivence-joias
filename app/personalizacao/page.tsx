import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './personalizacao.module.css'

export const metadata: Metadata = {
  title: 'Personalização | Vivence Jóias',
  description: 'Crie sua joia exclusiva sob medida. Gravações, adaptações de tamanho e designs únicos criados especialmente para você.',
}

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    title: 'Design Exclusivo',
    description: 'Criamos peças únicas baseadas em seus desejos e referências. Nossos designers transformam suas ideias em joias inesquecíveis.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
      </svg>
    ),
    title: 'Gravação Personalizada',
    description: 'Eternize mensagens especiais, datas ou nomes em suas joias. Oferecemos diferentes estilos de gravação artesanal.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Ajuste de Tamanho',
    description: 'Adaptamos perfeitamente qualquer peça ao seu tamanho, mantendo a integridade e beleza original da joia.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    title: 'Restauração',
    description: 'Devolvemos a vida às suas joias de família. Restauramos peças antigas com técnicas tradicionais e muito cuidado.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Consulta',
    description: 'Agende uma conversa para compartilhar suas ideias e referências. Nossos especialistas irão entender exatamente o que você deseja.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Nossa equipe criativa desenvolve o projeto da sua joia, com sketches e renderizações 3D para sua aprovação.',
  },
  {
    number: '03',
    title: 'Criação',
    description: 'Artesãos especializados dão vida ao seu design, utilizando técnicas tradicionais e materiais de primeira qualidade.',
  },
  {
    number: '04',
    title: 'Entrega',
    description: 'Sua joia exclusiva é entregue em uma embalagem especial, acompanhada de certificado de autenticidade.',
  },
]

export default function PersonalizacaoPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.label}>Exclusividade</span>
            <h1 className={styles.title}>Personalização</h1>
            <p className={styles.subtitle}>
              Transformamos seus sonhos em joias únicas. Crie peças exclusivas que contam a sua história.
            </p>
          </div>
        </section>

        <section className={styles.intro}>
          <div className={styles.container}>
            <div className={styles.introGrid}>
              <div className={styles.introText}>
                <h2 className={styles.introTitle}>Sua Visão, Nossa Arte</h2>
                <p className={styles.introDescription}>
                  Na Vivence Jóias, acreditamos que cada pessoa merece uma joia tão única quanto sua história. 
                  Nossa equipe de artesãos especialistas trabalha lado a lado com você para criar peças 
                  verdadeiramente exclusivas.
                </p>
                <p className={styles.introDescription}>
                  Seja para celebrar um momento especial, presentear alguém querido ou realizar um sonho 
                  antigo, estamos prontos para transformar suas ideias em realidade.
                </p>
              </div>
              <div className={styles.introImage}>
                <Image
                  src="/images/personalizacao.jpg"
                  alt="Processo de personalização de joias"
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.services}>
          <div className={styles.container}>
            <h2 className={styles.servicesTitle}>Nossos Serviços</h2>
            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <div key={service.title} className={styles.serviceCard}>
                  <span className={styles.serviceIcon}>{service.icon}</span>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.process}>
          <div className={styles.container}>
            <h2 className={styles.processTitle}>Como Funciona</h2>
            <div className={styles.stepsGrid}>
              {steps.map((step, index) => (
                <div key={step.number} className={styles.step}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                  {index < steps.length - 1 && <span className={styles.stepConnector} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Pronto para Criar Sua Joia Única?</h2>
              <p className={styles.ctaText}>
                Entre em contato conosco e agende uma consulta com nossos especialistas.
              </p>
              <Link href="/atendimento" className={styles.ctaButton}>
                Agendar Consulta
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
