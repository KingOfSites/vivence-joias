'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { useCart } from '@/context/CartContext'
import { ArrowLeft, Lock, CreditCard, Smartphone, MessageCircle } from 'lucide-react'
import styles from './pagamento.module.css'

type PaymentMethod = 'pix' | 'card' | 'whatsapp'

function parsePriceToReais(priceStr: string): number {
  const match = priceStr.replace(/\D/g, '')
  return match ? Number(match) / 100 : 0
}

export default function PagamentoPage() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('whatsapp')
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const { items, totalItems, loading } = useCart()

  const total = items.reduce((sum, i) => {
    return sum + parsePriceToReais(i.price) * i.quantity
  }, 0)
  const totalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(total)

  const whatsappMessage = encodeURIComponent(
    [
      'Olá! Gostaria de finalizar meu pedido:',
      '',
      ...items.map(
        (i) =>
          `• ${i.quantity}x ${i.name}${i.size ? ` (Tamanho ${i.size})` : ''} - ${i.price}`
      ),
      '',
      `Total: ${totalFormatted}`,
    ].join('\n')
  )

  const handlePagar = async () => {
    if (selectedMethod === 'whatsapp') {
      window.open(`https://wa.me/5511999999999?text=${whatsappMessage}`, '_blank')
      return
    }

    setPayError(null)
    setPayLoading(true)
    try {
      const payload = {
        items: items.map((item) => ({
          id: item.id,
          title: `${item.name}${item.size != null ? ` (Tam. ${item.size})` : ''}`,
          quantity: item.quantity,
          unit_price: parsePriceToReais(item.price),
          picture_url: item.image || undefined,
        })),
      }
      const res = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setPayError(data.error || 'Erro ao iniciar pagamento')
        return
      }
      if (data.initPoint) {
        window.location.href = data.initPoint
        return
      }
      setPayError('Resposta inválida do servidor')
    } catch (e) {
      setPayError('Falha ao conectar. Tente de novo.')
    } finally {
      setPayLoading(false)
    }
  }

  if (!loading && items.length === 0) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <Link href="/carrinho" className={styles.backLink}>
              <ArrowLeft size={18} /> Voltar ao carrinho
            </Link>
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Seu carrinho está vazio</p>
              <p>Adicione itens ao carrinho para ir ao pagamento.</p>
              <Link href="/colecoes" className={styles.emptyLink}>
                Ver coleções
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/carrinho" className={styles.backLink}>
            <ArrowLeft size={18} /> Voltar ao carrinho
          </Link>

          {/* Steps */}
          <div className={styles.steps}>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <span className={styles.stepDot} />
              Carrinho
            </div>
            <span style={{ color: 'var(--color-border)' }}>—</span>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <span className={`${styles.stepDot} ${styles.stepDotActive}`} />
              Pagamento
            </div>
          </div>

          {loading ? (
            <p className={styles.loading}>Carregando...</p>
          ) : (
            <>
              {/* Resumo do pedido */}
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Resumo do pedido</h2>
                <div className={styles.summaryList}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.summaryItem}>
                      <span className={styles.summaryItemName}>
                        {item.name}
                        {item.size != null && ` (Tam. ${item.size})`}
                      </span>
                      <span className={styles.summaryItemQty}>
                        {item.quantity}x
                      </span>
                      <span className={styles.summaryItemPrice}>
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span className={styles.summaryTotalValue}>
                    {totalFormatted}
                  </span>
                </div>
              </section>

              {/* Como você quer pagar? */}
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Como você quer pagar?</h2>
                <div className={styles.paymentMethods}>
                  <button
                    type="button"
                    className={`${styles.paymentOption} ${selectedMethod === 'pix' ? styles.paymentOptionSelected : ''}`}
                    onClick={() => setSelectedMethod('pix')}
                  >
                    <div className={styles.paymentIcon}>
                      <Smartphone size={22} />
                    </div>
                    <div>
                      <div className={styles.paymentLabel}>PIX</div>
                      <div className={styles.paymentDesc}>
                        Aprovação na hora
                      </div>
                    </div>
                    <div className={styles.paymentRadio} />
                  </button>

                  <button
                    type="button"
                    className={`${styles.paymentOption} ${selectedMethod === 'card' ? styles.paymentOptionSelected : ''}`}
                    onClick={() => setSelectedMethod('card')}
                  >
                    <div className={styles.paymentIcon}>
                      <CreditCard size={22} />
                    </div>
                    <div>
                      <div className={styles.paymentLabel}>Cartão de crédito</div>
                      <div className={styles.paymentDesc}>
                        Parcelamento disponível
                      </div>
                    </div>
                    <div className={styles.paymentRadio} />
                  </button>

                  <button
                    type="button"
                    className={`${styles.paymentOption} ${selectedMethod === 'whatsapp' ? styles.paymentOptionSelected : ''}`}
                    onClick={() => setSelectedMethod('whatsapp')}
                  >
                    <div className={styles.paymentIcon}>
                      <MessageCircle size={22} />
                    </div>
                    <div>
                      <div className={styles.paymentLabel}>WhatsApp</div>
                      <div className={styles.paymentDesc}>
                        Finalize e pague pelo WhatsApp
                      </div>
                    </div>
                    <div className={styles.paymentRadio} />
                  </button>
                </div>
              </section>

              {payError && (
                <p className={styles.payError} role="alert">
                  {payError}
                </p>
              )}
              {/* Botão Pagar */}
              <div className={styles.paySection}>
                <button
                  type="button"
                  className={styles.payButton}
                  onClick={handlePagar}
                  disabled={items.length === 0 || payLoading}
                >
                  {payLoading ? 'Redirecionando...' : 'Pagar '}
                  {!payLoading && (
                    <span className={styles.payButtonValue}>{totalFormatted}</span>
                  )}
                </button>
              </div>

              <p className={styles.secureNote}>
                <Lock size={14} className={styles.secureIcon} />
                Pagamento seguro · Seus dados estão protegidos
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
