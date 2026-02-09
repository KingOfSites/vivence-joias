'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Trash2, Minus, Plus } from 'lucide-react'
import styles from './carrinho.module.css'

export default function CarrinhoPage() {
  const { items, totalItems, removeItem, updateQuantity, loading } = useCart()
  const [updating, setUpdating] = useState<string | null>(null)

  const total = items.reduce((sum, i) => {
    const match = i.price.replace(/\D/g, '')
    const value = match ? Number(match) / 100 : 0
    return sum + value * i.quantity
  }, 0)
  const totalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(total)

  const handleRemove = async (id: string) => {
    setUpdating(id)
    await removeItem(id)
    setUpdating(null)
  }

  const handleQuantity = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const newQty = item.quantity + delta
    if (newQty < 1) {
      await handleRemove(id)
      return
    }
    setUpdating(id)
    await updateQuantity(id, newQty)
    setUpdating(null)
  }

  const whatsappMessage = encodeURIComponent(
    items
      .map(
        (i) =>
          `${i.quantity}x ${i.name}${i.size ? ` (Tamanho ${i.size})` : ''} - ${i.price}`
      )
      .join('\n')
  )

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <span className={styles.label}>Carrinho</span>
            <h1 className={styles.title}>
              {totalItems > 0
                ? `${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`
                : 'Seu carrinho'}
            </h1>
          </header>

          <div className={styles.content}>
            {loading ? (
              <div className={styles.empty}>
                <p>Carregando...</p>
              </div>
            ) : items.length === 0 ? (
              <div className={styles.empty}>
                <ShoppingBag className={styles.emptyIcon} />
                <p className={styles.emptyTitle}>Seu carrinho está vazio</p>
                <p>Adicione peças que você ama e finalize pelo WhatsApp.</p>
                <Link href="/colecoes" className={styles.link}>
                  Ver coleções
                </Link>
              </div>
            ) : (
              <>
                <ul className={styles.list}>
                  {items.map((item) => (
                    <li key={item.id} className={styles.item}>
                      <Link
                        href={`/produto/${item.productSlug}`}
                        className={styles.itemImage}
                      >
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          sizes="120px"
                        />
                      </Link>
                      <div className={styles.itemInfo}>
                        <Link
                          href={`/produto/${item.productSlug}`}
                          className={styles.itemName}
                        >
                          {item.name}
                        </Link>
                        <p className={styles.itemPrice}>{item.price}</p>
                        {item.size != null && (
                          <p className={styles.itemSize}>Tamanho {item.size}</p>
                        )}
                        <div className={styles.itemActions}>
                          <div className={styles.quantity}>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() => handleQuantity(item.id, -1)}
                              disabled={updating === item.id}
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={16} />
                            </button>
                            <span className={styles.qtyValue}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() => handleQuantity(item.id, 1)}
                              disabled={updating === item.id}
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => handleRemove(item.id)}
                            disabled={updating === item.id}
                            aria-label="Remover do carrinho"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <section className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal ({totalItems} itens)</span>
                    <span>{totalFormatted}</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
                    <span>Total</span>
                    <strong>{totalFormatted}</strong>
                  </div>
                  <Link href="/carrinho/pagamento" className={styles.checkoutBtn}>
                    Pagar
                  </Link>
                  <a
                    href={`https://wa.me/5511999999999?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappLink}
                  >
                    Finalizar pelo WhatsApp
                  </a>
                  <p className={styles.shippingNote}>
                    Frete grátis em compras acima de R$ 1.000,00
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
