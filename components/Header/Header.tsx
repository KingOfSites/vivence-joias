'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ShoppingBag, User, LogOut, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import styles from './Header.module.css'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/colecoes', label: 'Coleções' },
  { href: '/atendimento', label: 'Atendimento' },
  { href: '/nossa-historia', label: 'Nossa História' },
  { href: '/personalizacao', label: 'Personalização' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { totalItems } = useCart()
  const { user, loading: authLoading, logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.active : ''}`} />
        </button>

        <ul className={`${styles.navLinks} ${styles.leftLinks}`}>
          {navLinks.slice(0, 3).map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Vivence</span>
          <span className={styles.logoAccent}>Jóias</span>
        </Link>

        <ul className={`${styles.navLinks} ${styles.rightLinks}`}>
          {navLinks.slice(3).map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {!authLoading && (
              <>
                {user ? (
                  <div className={styles.userMenuWrap} ref={userMenuRef}>
                    <button
                      type="button"
                      className={styles.userMenuButton}
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      <User size={18} />
                      <span className={styles.userName}>
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown size={14} className={userMenuOpen ? styles.chevronOpen : ''} />
                    </button>
                    {userMenuOpen && (
                      <div className={styles.userDropdown}>
                        <span className={styles.userDropdownEmail}>{user.email}</span>
                        <button
                          type="button"
                          className={styles.userDropdownItem}
                          onClick={() => {
                            setUserMenuOpen(false)
                            logout()
                          }}
                        >
                          <LogOut size={16} /> Sair
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className={styles.navLink}>
                    Entrar
                  </Link>
                )}
              </>
            )}
          </li>
          <li>
            <Link href="/carrinho" className={styles.cartLink}>
              <span className={styles.cartLinkIcon}>
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className={styles.cartBadge}>{totalItems > 99 ? '99+' : totalItems}</span>
                )}
              </span>
              Carrinho
            </Link>
          </li>
        </ul>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <ul className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!authLoading && (
              <li className={styles.mobileAuthWrap}>
                {user ? (
                  <>
                    <span className={styles.mobileUser}>Olá, {user.name.split(' ')[0]}</span>
                    <button
                      type="button"
                      className={styles.mobileNavLink}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }}
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                )}
              </li>
            )}
            <li>
              <Link
                href="/carrinho"
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Carrinho {totalItems > 0 ? `(${totalItems})` : ''}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
