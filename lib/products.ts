export interface ProductSpec {
  label: string
  value: string
}

export interface ProductDetail {
  id: number
  slug: string
  name: string
  price: string
  priceRaw: number
  image: string
  gallery?: string[]
  category: string
  description: string[]
  specifications: ProductSpec[]
  sizes: number[]
}

export const products: ProductDetail[] = [
  {
    id: 1,
    slug: 'anel-solitario-eterno',
    name: 'Anel Solitário Eterno',
    price: 'R$ 2.890,00',
    priceRaw: 2890,
    image: '/images/product-1.png',
    gallery: ['/images/product-1.png', '/images/product-2.png', '/images/product-3.png'],
    category: 'Ouro 18K',
    description: [
      'O Anel Solitário Eterno é uma peça que transcende o tempo, criada para celebrar os momentos mais significativos da vida. Com design minimalista e elegante, este anel em Ouro 18K representa a pureza e a durabilidade dos sentimentos verdadeiros.',
      'Cada detalhe foi cuidadosamente pensado para garantir conforto e beleza atemporal. Uma joia que se torna parte da sua história, passando de geração em geração.',
    ],
    specifications: [
      { label: 'Material', value: 'Ouro 18K (750)' },
      { label: 'Peso', value: '3,2g' },
      { label: 'Largura', value: '2,5mm' },
      { label: 'Acabamento', value: 'Polido brilhante' },
      { label: 'Tamanhos disponíveis', value: '12 a 20 (ajuste gratuito)' },
      { label: 'Garantia', value: '2 anos contra defeitos de fabricação' },
    ],
    sizes: [12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
  {
    id: 2,
    slug: 'colar-perola-lunar',
    name: 'Colar Pérola Lunar',
    price: 'R$ 1.590,00',
    priceRaw: 1590,
    image: '/images/product-2.png',
    gallery: ['/images/product-2.png', '/images/product-1.png', '/images/product-4.png'],
    category: 'Prata 925',
    description: [
      'O Colar Pérola Lunar combina a delicadeza das pérolas naturais com o brilho da Prata 925. Uma peça versátil que transita do dia a dia às ocasiões especiais.',
      'O fecho em segurança garante praticidade e durabilidade. Ideal para presentear ou para realçar qualquer look com elegância.',
    ],
    specifications: [
      { label: 'Material', value: 'Prata 925 e pérolas naturais' },
      { label: 'Comprimento', value: '45cm (ajustável)' },
      { label: 'Acabamento', value: 'Rodio e polido' },
      { label: 'Garantia', value: '2 anos contra defeitos de fabricação' },
    ],
    sizes: [],
  },
  {
    id: 3,
    slug: 'brincos-aurora',
    name: 'Brincos Aurora',
    price: 'R$ 890,00',
    priceRaw: 890,
    image: '/images/product-3.png',
    gallery: ['/images/product-3.png', '/images/product-2.png', '/images/product-1.png'],
    category: 'Prata 925',
    description: [
      'Os Brincos Aurora em formato de gota trazem leveza e brilho para o dia a dia. Em Prata 925 com acabamento em rodio, são leves e confortáveis.',
      'Perfeitos para quem busca sofisticação sem exageros. Um clássico que nunca sai de moda.',
    ],
    specifications: [
      { label: 'Material', value: 'Prata 925' },
      { label: 'Acabamento', value: 'Rodio' },
      { label: 'Fechamento', value: 'Articulado com segurança' },
      { label: 'Garantia', value: '2 anos contra defeitos de fabricação' },
    ],
    sizes: [],
  },
  {
    id: 4,
    slug: 'pulseira-corrente-real',
    name: 'Pulseira Corrente Real',
    price: 'R$ 3.490,00',
    priceRaw: 3490,
    image: '/images/product-4.png',
    gallery: ['/images/product-4.png', '/images/product-1.png', '/images/product-3.png'],
    category: 'Ouro 18K',
    description: [
      'A Pulseira Corrente Real em Ouro 18K é um clássico da joalheria. Elaborada com elos sólidos e fecho de segurança, une resistência e elegância.',
      'Uma peça atemporal que valoriza qualquer pulso e pode ser usada sozinha ou empilhada com outras pulseiras.',
    ],
    specifications: [
      { label: 'Material', value: 'Ouro 18K (750)' },
      { label: 'Comprimento', value: '18cm' },
      { label: 'Acabamento', value: 'Polido brilhante' },
      { label: 'Fechamento', value: 'Duplo segurança' },
      { label: 'Garantia', value: '2 anos contra defeitos de fabricação' },
    ],
    sizes: [],
  },
]

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return products.find((p) => p.slug === slug)
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug)
}

export function getRelatedProducts(currentSlug: string, limit = 3): ProductDetail[] {
  return products.filter((p) => p.slug !== currentSlug).slice(0, limit)
}

export function getProductsByCategory(category: string): ProductDetail[] {
  const normalized = category.toLowerCase().replace(/-/g, ' ')
  return products.filter((p) => p.category.toLowerCase().replace(/\s/g, ' ').includes(normalized) || p.category.toLowerCase().replace(/\s/g, '-').includes(category.toLowerCase()))
}

export function getProductsByCollectionSlug(slug: string): ProductDetail[] {
  const s = slug.toLowerCase()
  if (s === 'ouro-18k') return products.filter((p) => p.category === 'Ouro 18K')
  if (s === 'prata-925') return products.filter((p) => p.category === 'Prata 925')
  if (s === 'aneis') return products.filter((p) => p.slug.includes('anel'))
  if (s === 'colares') return products.filter((p) => p.slug.includes('colar'))
  if (s === 'brincos') return products.filter((p) => p.slug.includes('brinco'))
  if (s === 'pulseiras') return products.filter((p) => p.slug.includes('pulseira'))
  return products
}
