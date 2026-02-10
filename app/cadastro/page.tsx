'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft, Lock } from 'lucide-react'
import styles from '../login/login.module.css'

export default function CadastroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { register, user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/')
    }
  }, [user, authLoading, router])

  if (authLoading || user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await register(email.trim(), password, name.trim())
      if (result.error) {
        setError(result.error)
        return
      }
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={18} /> Voltar
          </Link>

          <div className={styles.card}>
            <h1 className={styles.title}>Criar conta</h1>
            <p className={styles.subtitle}>
              Cadastre-se para uma experiência personalizada.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}
              <label className={styles.label}>
                Nome
                <input
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  autoComplete="name"
                />
              </label>
              <label className={styles.label}>
                E-mail
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                />
              </label>
              <label className={styles.label}>
                Senha (mínimo 6 caracteres)
                <input
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </label>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <p className={styles.footerText}>
              Já tem conta?{' '}
              <Link href="/login" className={styles.link}>
                Entrar
              </Link>
            </p>
          </div>

          <p className={styles.secureNote}>
            <Lock size={14} className={styles.secureIcon} />
            Conexão segura
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
