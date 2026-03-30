'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import styles from './obrigado.module.css'

function ObrigadoContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || ''
  const [isCreatingOrder, setIsCreatingOrder] = useState(true)
  const { refreshCart } = useCart()

  useEffect(() => {
    if (status === 'approved') {
      createOrder()
    } else {
      setIsCreatingOrder(false)
    }
  }, [status])

  const createOrder = async () => {
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        console.error('Erro ao criar pedido:', res.statusText)
      } else {
        await refreshCart()
      }
    } catch (error) {
      console.error('Erro ao registrar pedido:', error)
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const config = {
    approved: {
      icon: CheckCircle,
      title: 'Pagamento aprovado',
      message:
        'Obrigado pela sua compra! Em breve entraremos em contato com os detalhes da entrega.',
      className: styles.statusSuccess,
    },
    pending: {
      icon: Clock,
      title: 'Pagamento pendente',
      message:
        'Seu pagamento está em processamento. Você receberá uma confirmação quando for aprovado.',
      className: styles.statusPending,
    },
    rejected:
      status === 'rejected' || status === 'failure'
        ? {
            icon: XCircle,
            title: 'Pagamento não realizado',
            message:
              'Não foi possível concluir o pagamento. Você pode tentar novamente ou finalizar pelo WhatsApp.',
            className: styles.statusFailure,
          }
        : null,
  }

  const key =
    status === 'approved'
      ? 'approved'
      : status === 'pending'
        ? 'pending'
        : status === 'rejected' || status === 'failure'
          ? 'rejected'
          : 'approved'
  const item = key === 'rejected' && config.rejected ? config.rejected : config[key as keyof typeof config]
  const Icon = item?.icon ?? CheckCircle

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={`${styles.card} ${item?.className ?? ''}`}>
            <div className={styles.iconWrap}>
              <Icon size={48} className={styles.icon} />
            </div>
            <h1 className={styles.title}>{item?.title ?? 'Obrigado!'}</h1>
            <p className={styles.message}>{item?.message ?? 'Seu pedido foi recebido.'}</p>
            {isCreatingOrder && status === 'approved' && (
              <p className={styles.message} style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.7 }}>
                Registrando seu pedido...
              </p>
            )}
            <div className={styles.actions}>
              <Link href="/" className={styles.primaryLink}>
                Voltar ao início
              </Link>
              <Link href="/colecoes" className={styles.secondaryLink}>
                Ver coleções
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.card}>
              <p className={styles.message}>Carregando...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    }>
      <ObrigadoContent />
    </Suspense>
  )
}
