import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import { logout } from '../api/auth';
import DarkModeToggle from './DarkModeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';
import './Navbar.css';

function Navbar() {
  const { utilisateur, deconnecter } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // ignorer les erreurs de déconnexion
    } finally {
      deconnecter();
      navigate('/');
    }
  };

  // déterminer le lien dashboard selon le rôle
  const getDashboardLink = () => {
    if (!utilisateur) return '/';
    switch (utilisateur.role) {
      case 'etudiant': return '/etudiant/dashboard';
      case 'societe':  return '/societe/dashboard';
      case 'admin':    return '/admin/dashboard';
      default:         return '/';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand brand-logo" to="/">
          <i className="fas fa-briefcase me-2"></i>
          StageConnect
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">{t('nav.home')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/stages">{t('nav.offers')}</Link>
            </li>

            {utilisateur && utilisateur.role === 'etudiant' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/etudiant/candidatures">{t('nav.myCandidatures')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/etudiant/favoris">{t('nav.myFavoris')}</Link>
                </li>
              </>
            )}

            {utilisateur && utilisateur.role === 'societe' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/societe/offres">{t('nav.myOffers')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/societe/stats">{t('nav.stats')}</Link>
                </li>
              </>
            )}

            {utilisateur && utilisateur.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/utilisateurs">{t('nav.users')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/stages">{t('nav.stages')}</Link>
                </li>
              </>
            )}
          </ul>

          <div className="navbar-actions d-flex align-items-center gap-2">
            <LanguageSwitcher />
            <DarkModeToggle />

            {!utilisateur ? (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  {t('nav.register')}
                </Link>
              </>
            ) : (
              <>
                <NotificationBell />
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-user-circle"></i>
                    <span className="d-none d-md-inline">{utilisateur.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to={getDashboardLink()}>
                        <i className="fas fa-tachometer-alt me-2"></i>
                        {t('nav.dashboard')}
                      </Link>
                    </li>
                    {utilisateur.role !== 'admin' && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to={utilisateur.role === 'societe' ? '/societe/profile' : '/etudiant/profile'}
                        >
                          <i className="fas fa-user me-2"></i>
                          {t('nav.profile')}
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>
                        {t('nav.logout')}
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
