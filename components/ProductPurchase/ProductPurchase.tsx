'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { useCart } from '@/context/CartContext'
import type { ProductDetail } from '@/lib/products'

type ProductPurchaseStyles = {
  gallery: string
  mainImage: string
  image: string
  shine: string
  thumbnailGrid: string
  thumbnail: string
  thumbnailImage: string
  productInfo: string
  category: string
  title: string
  price: string
  description: string
  specifications: string
  specsTitle: string
  specsList: string
  specLabel: string
  specValue: string
  sizeSelector: string
  sizeLabel: string
  sizeOptions: string
  sizeButton: string
  sizeButtonSelected: string
  sizeHelp: string
  sizeLink: string
  quantityRow: string
  quantityLabel: string
  quantityControls: string
  quantityButton: string
  quantityValue: string
  actions: string
  buyButton: string
  buyButtonSecondary: string
  shippingInfo: string
  shippingItem: string
  shippingIcon: string
  shippingTitle: string
  shippingText: string
}

interface ProductPurchaseProps {
  product: ProductDetail
  styles: ProductPurchaseStyles
}

export default function ProductPurchase({ product, styles: s }: ProductPurchaseProps) {
  const [selectedImage, setSelectedImage] = useState(product.gallery?.[0] ?? product.image)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const { addItem } = useCart()

  const images = product.gallery?.length ? product.gallery : [product.image]

  const handleAddToCart = async () => {
    if (product.sizes.length && selectedSize === null) {
      toast.error('Selecione o tamanho', {
        description: 'Escolha um tamanho antes de adicionar ao carrinho.',
      })
      return
    }
    setAdding(true)
    const ok = await addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      priceRaw: product.priceRaw,
      image: product.image,
      quantity,
      size: selectedSize ?? undefined,
    })
    setAdding(false)
    if (ok) {
      toast.success('Adicionado ao carrinho', {
        description: `${quantity}x ${product.name}${selectedSize ? ` - Tamanho ${selectedSize}` : ''}`,
      })
    } else {
      toast.error('Erro', {
        description: 'Não foi possível adicionar ao carrinho. Tente novamente.',
      })
    }
  }

  const handleBuyNow = () => {
    if (product.sizes.length && selectedSize === null) {
      toast({
        title: 'Selecione o tamanho',
        description: 'Escolha um tamanho antes de comprar.',
        variant: 'destructive',
      })
      return
    }
    const message = encodeURIComponent(
      `Olá! Gostaria de comprar: ${product.name} (${product.price})${selectedSize ? ` - Tamanho ${selectedSize}` : ''} - Quantidade: ${quantity}`
    )
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank')
  }

  return (
    <>
      <div className={s.gallery}>
        <div className={s.mainImage}>
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className={s.image}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className={s.shine} />
        </div>
        {images.length > 1 && (
          <div className={s.thumbnailGrid}>
            {images.map((src) => (
              <button
                key={src}
                type="button"
                className={s.thumbnail}
                onClick={() => setSelectedImage(src)}
                aria-label={`Ver imagem ${src}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className={s.thumbnailImage}
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={s.productInfo}>
        <span className={s.category}>{product.category}</span>
        <h1 className={s.title}>{product.name}</h1>
        <p className={s.price}>{product.price}</p>

        <div className={s.description}>
          {product.description.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className={s.specifications}>
          <h3 className={s.specsTitle}>Especificações Técnicas</h3>
          <ul className={s.specsList}>
            {product.specifications.map((spec) => (
              <li key={spec.label}>
                <span className={s.specLabel}>{spec.label}:</span>
                <span className={s.specValue}>{spec.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {product.sizes.length > 0 && (
          <div className={s.sizeSelector}>
            <label className={s.sizeLabel}>Tamanho</label>
            <div className={s.sizeOptions}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`${s.sizeButton} ${selectedSize === size ? s.sizeButtonSelected : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className={s.sizeHelp}>
              Não sabe seu tamanho?{' '}
              <Link href="/atendimento" className={s.sizeLink}>
                Entre em contato
              </Link>
            </p>
          </div>
        )}

        <div className={s.quantityRow}>
          <label className={s.quantityLabel}>Quantidade</label>
          <div className={s.quantityControls}>
            <button
              type="button"
              className={s.quantityButton}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span className={s.quantityValue}>{quantity}</span>
            <button
              type="button"
              className={s.quantityButton}
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
        </div>

        <div className={s.actions}>
          <button
            type="button"
            className={s.buyButton}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
          </button>
          <button type="button" className={s.buyButtonSecondary} onClick={handleBuyNow}>
            Comprar Agora (WhatsApp)
          </button>
        </div>

        <div className={s.shippingInfo}>
          <div className={s.shippingItem}>
            <span className={s.shippingIcon}>🚚</span>
            <div>
              <p className={s.shippingTitle}>Frete Grátis</p>
              <p className={s.shippingText}>Para compras acima de R$ 1.000,00</p>
            </div>
          </div>
          <div className={s.shippingItem}>
            <span className={s.shippingIcon}>🔒</span>
            <div>
              <p className={s.shippingTitle}>Compra Segura</p>
              <p className={s.shippingText}>Pagamento 100% seguro e protegido</p>
            </div>
          </div>
          <div className={s.shippingItem}>
            <span className={s.shippingIcon}>↩️</span>
            <div>
              <p className={s.shippingTitle}>Troca Garantida</p>
              <p className={s.shippingText}>7 dias para troca ou devolução</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
