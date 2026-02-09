import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagamento | Vivence Jóias',
  description: 'Finalize sua compra com segurança.',
}

export default function PagamentoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
