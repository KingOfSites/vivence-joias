import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandSection}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>Vivence</span>
              <span className={styles.logoAccent}>Jóias</span>
            </Link>
            <p className={styles.tagline}>
              A eternidade moldada em metais nobres.
            </p>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Navegação</h4>
            <ul className={styles.linksList}>
              <li><Link href="/" className={styles.link}>Home</Link></li>
              <li><Link href="/colecoes" className={styles.link}>Coleções</Link></li>
              <li><Link href="/carrinho" className={styles.link}>Carrinho</Link></li>
              <li><Link href="/nossa-historia" className={styles.link}>Nossa História</Link></li>
              <li><Link href="/personalizacao" className={styles.link}>Personalização</Link></li>
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Coleções</h4>
            <ul className={styles.linksList}>
              <li><Link href="/colecoes/prata-925" className={styles.link}>Prata 925</Link></li>
              <li><Link href="/colecoes/ouro-18k" className={styles.link}>Ouro 18K</Link></li>
              <li><Link href="/colecoes/aneis" className={styles.link}>Anéis</Link></li>
              <li><Link href="/colecoes/colares" className={styles.link}>Colares</Link></li>
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Atendimento</h4>
            <ul className={styles.linksList}>
              <li><Link href="/atendimento" className={styles.link}>Fale Conosco</Link></li>
              <li><Link href="/atendimento#faq" className={styles.link}>Perguntas Frequentes</Link></li>
              <li><Link href="/atendimento#trocas" className={styles.link}>Trocas e Devoluções</Link></li>
              <li><Link href="/atendimento#garantia" className={styles.link}>Garantia</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.socialSection}>
          <div className={styles.socialLinks}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.socialIcon}>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon}>
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.divider} />
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Vivence Jóias. Todos os direitos reservados.
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/privacidade" className={styles.bottomLink}>Política de Privacidade</Link>
              <Link href="/termos" className={styles.bottomLink}>Termos de Uso</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
