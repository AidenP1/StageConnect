import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Footer.css';

function Footer() {
  const { t } = useLang();

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
          </div>

          {/* liens rapides */}
          <div className="col-md-4">
            <h5 className="footer-heading">{t('footer.quickLinks')}</h5>
            <ul className="footer-links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/stages">{t('nav.offers')}</Link></li>
              <li><Link to="/login">{t('nav.login')}</Link></li>
              <li><Link to="/register">{t('nav.register')}</Link></li>
            </ul>
          </div>

          {/* sélecteur de langue */}
          <div className="col-md-4">
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
