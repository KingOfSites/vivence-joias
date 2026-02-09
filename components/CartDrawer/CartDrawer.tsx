'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Trash2, Minus, Plus } from 'lucide-react'
import styles from './CartDrawer.module.css'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, totalItems, removeItem, updateQuantity } = useCart()
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={styles.sheet}
      >
        <div className={styles.wrapper}>
        <SheetHeader>
          <SheetTitle className={styles.title}>Carrinho</SheetTitle>
        </SheetHeader>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag className={styles.emptyIcon} />
              <p>Seu carrinho está vazio</p>
              <Link
                href="/colecoes"
                className={styles.link}
                onClick={() => onOpenChange(false)}
              >
                Ver coleções
              </Link>
            </div>
          ) : (
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      sizes="80px"
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <Link
                      href={`/produto/${item.productSlug}`}
                      className={styles.itemName}
                      onClick={() => onOpenChange(false)}
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
                          aria-label="Diminuir"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => handleQuantity(item.id, 1)}
                          disabled={updating === item.id}
                          aria-label="Aumentar"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemove(item.id)}
                        disabled={updating === item.id}
                        aria-label="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className={styles.footer}>
            <div className={styles.total}>
              <span>Total</span>
              <strong>{totalFormatted}</strong>
            </div>
            <a
              href={`https://wa.me/5511999999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.checkoutBtn}
              onClick={() => onOpenChange(false)}
            >
              Finalizar no WhatsApp
            </a>
          </SheetFooter>
        )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
