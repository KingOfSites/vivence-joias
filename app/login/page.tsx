'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft, Lock } from 'lucide-react'
import styles from './login.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login, user, loading: authLoading } = useAuth()
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
      const result = await login(email.trim(), password)
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
            <h1 className={styles.title}>Entrar</h1>
            <p className={styles.subtitle}>
              Acesse sua conta para acompanhar pedidos e preferências.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}
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
                Senha
                <input
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </label>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className={styles.footerText}>
              Ainda não tem conta?{' '}
              <Link href="/cadastro" className={styles.link}>
                Criar conta
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
