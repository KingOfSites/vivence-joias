import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrinho | Vivence Jóias',
  description: 'Revise seus itens e finalize sua compra pelo WhatsApp.',
}

export default function CarrinhoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
