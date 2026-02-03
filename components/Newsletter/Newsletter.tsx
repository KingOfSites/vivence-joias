'use client'

import React from "react"

import { useState } from 'react'
import styles from './Newsletter.module.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setStatus('success')
    setEmail('')
    
    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section className={styles.newsletter}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.label}>Newsletter</span>
          <h2 className={styles.title}>Receba Novidades Exclusivas</h2>
          <p className={styles.description}>
            Seja o primeiro a conhecer nossas novas coleções, ofertas especiais e eventos exclusivos.
          </p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className={styles.input}
                disabled={status === 'loading' || status === 'success'}
                required
              />
              <button
                type="submit"
                className={styles.button}
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? (
                  <span className={styles.spinner} />
                ) : status === 'success' ? (
                  'Inscrito!'
                ) : (
                  'Inscrever'
                )}
              </button>
            </div>
            {status === 'success' && (
              <p className={styles.successMessage}>
                Obrigado por se inscrever! Em breve você receberá nossas novidades.
              </p>
            )}
          </form>

          <p className={styles.privacy}>
            Ao se inscrever, você concorda com nossa Política de Privacidade.
          </p>
        </div>
      </div>
    </section>
  )
}
