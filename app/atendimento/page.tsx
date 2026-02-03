'use client'

import React from "react"

import { useState } from 'react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './atendimento.module.css'

const faqs = [
  {
    question: 'Como posso verificar a autenticidade das joias?',
    answer: 'Todas as nossas peças acompanham certificado de autenticidade e garantia. Nossas joias de Prata 925 e Ouro 18K possuem contraste oficial e podem ser verificadas em laboratórios especializados.',
  },
  {
    question: 'Qual é o prazo de entrega?',
    answer: 'O prazo de entrega varia de acordo com sua localização. Para São Paulo capital, entregamos em até 3 dias úteis. Para outras regiões, o prazo é de 5 a 10 dias úteis. Peças personalizadas têm prazo específico informado no momento da compra.',
  },
  {
    question: 'Vocês oferecem garantia?',
    answer: 'Sim, todas as nossas joias possuem garantia de 1 ano contra defeitos de fabricação. Oferecemos também serviço de manutenção e limpeza gratuito durante o período de garantia.',
  },
  {
    question: 'Como funciona o processo de personalização?',
    answer: 'O processo começa com uma consulta para entendermos suas preferências. Em seguida, desenvolvemos o design, apresentamos para aprovação e, após confirmação, iniciamos a criação da peça. O prazo médio é de 30 a 45 dias.',
  },
  {
    question: 'Posso trocar ou devolver uma peça?',
    answer: 'Sim, você tem até 7 dias após o recebimento para solicitar troca ou devolução, desde que a peça esteja em perfeito estado e com a embalagem original. Peças personalizadas não são passíveis de troca ou devolução.',
  },
]

const contactInfo = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: 'Telefone',
    value: '(11) 3456-7890',
    link: 'tel:+551134567890',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: 'E-mail',
    value: 'contato@vivencejoias.com.br',
    link: 'mailto:contato@vivencejoias.com.br',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
    title: 'WhatsApp',
    value: '(11) 99999-9999',
    link: 'https://wa.me/5511999999999',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Endereço',
    value: 'Rua Oscar Freire, 123 - Jardins, São Paulo - SP',
    link: 'https://maps.google.com',
  },
]

export default function AtendimentoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setFormStatus('success')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    
    setTimeout(() => setFormStatus('idle'), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.label}>Suporte</span>
            <h1 className={styles.title}>Atendimento</h1>
            <p className={styles.subtitle}>
              Estamos aqui para ajudar. Entre em contato conosco e teremos prazer em atendê-lo.
            </p>
          </div>
        </section>

        <section className={styles.contact}>
          <div className={styles.container}>
            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <h2 className={styles.sectionTitle}>Entre em Contato</h2>
                <p className={styles.sectionDescription}>
                  Nossa equipe está disponível para atender suas dúvidas e solicitações de segunda a sexta, das 9h às 18h.
                </p>
                
                <div className={styles.contactList}>
                  {contactInfo.map((info) => (
                    <a key={info.title} href={info.link} className={styles.contactItem} target={info.link.startsWith('http') ? '_blank' : undefined} rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      <span className={styles.contactIcon}>{info.icon}</span>
                      <div className={styles.contactDetails}>
                        <span className={styles.contactTitle}>{info.title}</span>
                        <span className={styles.contactValue}>{info.value}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.formWrapper}>
                <h2 className={styles.formTitle}>Envie uma Mensagem</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name" className={styles.formLabel}>Nome</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                        disabled={formStatus !== 'idle'}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.formLabel}>E-mail</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                        disabled={formStatus !== 'idle'}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone" className={styles.formLabel}>Telefone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.formInput}
                        disabled={formStatus !== 'idle'}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="subject" className={styles.formLabel}>Assunto</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={styles.formSelect}
                        required
                        disabled={formStatus !== 'idle'}
                      >
                        <option value="">Selecione</option>
                        <option value="duvidas">Dúvidas</option>
                        <option value="pedidos">Pedidos</option>
                        <option value="personalizacao">Personalização</option>
                        <option value="trocas">Trocas e Devoluções</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.formLabel}>Mensagem</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={styles.formTextarea}
                      rows={5}
                      required
                      disabled={formStatus !== 'idle'}
                    />
                  </div>
                  <button type="submit" className={styles.formButton} disabled={formStatus !== 'idle'}>
                    {formStatus === 'loading' ? (
                      <span className={styles.spinner} />
                    ) : formStatus === 'success' ? (
                      'Mensagem Enviada!'
                    ) : (
                      'Enviar Mensagem'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className={styles.faq}>
          <div className={styles.container}>
            <h2 className={styles.faqTitle}>Perguntas Frequentes</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <div key={index} className={`${styles.faqItem} ${openFaq === index ? styles.open : ''}`}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>{faq.question}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.faqIcon}>
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
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
