import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Footer.css';

function Footer() {
  const { t } = useLang();
  const { utilisateur } = useAuth();

  const [email, setEmail] = useState('');
  const [abonne, setAbonne] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // stocker localement (pas de backend email pour l'instant)
    const liste = JSON.parse(localStorage.getItem('newsletter') || '[]');
    if (!liste.includes(email)) liste.push(email);
    localStorage.setItem('newsletter', JSON.stringify(liste));
    setAbonne(true);
    setEmail('');
    setTimeout(() => setAbonne(false), 4000);
  };

  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4 footer-content">
          {/* logo et description */}
          <div className="col-md-4">
            <div className="footer-brand">
              <i className="fas fa-briefcase me-2"></i>
              <span className="footer-logo-text">StageConnect</span>
            </div>
            <p className="footer-desc">{t('footer.description')}</p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X"><i className="fab fa-x-twitter"></i></a>
            </div>
          </div>

          {/* liens rapides */}
          <div className="col-md-2">
            <h5 className="footer-heading">{t('footer.quickLinks')}</h5>
            <ul className="footer-links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/stages">{t('nav.offers')}</Link></li>
              {!utilisateur ? (
                <>
                  <li><Link to="/login">{t('nav.login')}</Link></li>
                  <li><Link to="/register">{t('nav.register')}</Link></li>
                </>
              ) : (
                <li>
                  <Link to={
                    utilisateur.role === 'etudiant' ? '/etudiant/dashboard'
                    : utilisateur.role === 'societe' ? '/societe/dashboard'
                    : '/admin/dashboard'
                  }>
                    {t('nav.dashboard')}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* newsletter */}
          <div className="col-md-3">
            <h5 className="footer-heading">{t('footer.newsletterTitle')}</h5>
            <p className="footer-desc" style={{ marginBottom: 12 }}>{t('footer.newsletterDesc')}</p>
            {abonne ? (
              <div className="footer-newsletter-success">
                <i className="fas fa-check-circle me-2"></i>{t('footer.newsletterSuccess')}
              </div>
            ) : (
              <form className="footer-newsletter" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  className="form-control"
                  placeholder={t('footer.newsletterPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" aria-label="subscribe">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            )}
          </div>

          {/* sélecteur de langue */}
          <div className="col-md-3">
            <h5 className="footer-heading">Langue / Language</h5>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t('footer.copyright')}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
