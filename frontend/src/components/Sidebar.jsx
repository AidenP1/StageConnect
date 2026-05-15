import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { getNonLus } from '../api/messages';
import { getImageUrl } from '../utils/helpers';
import './Sidebar.css';

function Sidebar() {
  const { utilisateur } = useAuth();
  const { t } = useLang();
  const location = useLocation();
  const [nonLusMsg, setNonLusMsg] = useState(0);

  useEffect(() => {
    if (!utilisateur || utilisateur.role === 'admin') return;

    getNonLus()
      .then((data) => setNonLusMsg(data.non_lus || 0))
      .catch(() => {});
  }, [utilisateur, location.pathname]);

  if (!utilisateur) return null;

  const avatarPath = utilisateur.societe_profile?.logo_path || utilisateur.etudiant_profile?.photo_path;
  const avatarUrl = avatarPath ? getImageUrl(avatarPath) : null;

  const linksEtudiant = [
    { to: '/etudiant/dashboard', icon: 'fa-tachometer-alt', label: t('nav.dashboard') },
    { to: '/etudiant/stages',    icon: 'fa-search',         label: t('nav.offers') },
    { to: '/etudiant/candidatures', icon: 'fa-file-alt',   label: t('nav.myCandidatures') },
    { to: '/etudiant/favoris',   icon: 'fa-heart',          label: t('nav.myFavoris') },
    { to: '/etudiant/messages',  icon: 'fa-comments',       label: 'Messages', badge: nonLusMsg },
    { to: '/etudiant/profile',   icon: 'fa-user',           label: t('nav.profile') },
  ];

  const linksSociete = [
    { to: '/societe/dashboard', icon: 'fa-tachometer-alt', label: t('nav.dashboard') },
    { to: '/societe/offres',    icon: 'fa-list',           label: t('nav.myOffers') },
    { to: '/societe/offres/nouvelle', icon: 'fa-plus',     label: t('nav.newOffer') },
    { to: '/societe/stats',     icon: 'fa-chart-bar',      label: t('nav.stats') },
    { to: '/societe/messages',  icon: 'fa-comments',       label: 'Messages', badge: nonLusMsg },
    { to: '/societe/profile',   icon: 'fa-building',       label: t('nav.profile') },
  ];

  const linksAdmin = [
    { to: '/admin/dashboard',     icon: 'fa-tachometer-alt', label: t('nav.dashboard') },
    { to: '/admin/utilisateurs',  icon: 'fa-users',          label: t('nav.users') },
    { to: '/admin/stages',        icon: 'fa-briefcase',      label: t('nav.stages') },
  ];

  const links = utilisateur.role === 'etudiant'
    ? linksEtudiant
    : utilisateur.role === 'societe'
    ? linksSociete
    : linksAdmin;

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={utilisateur.name} />
          ) : (
            utilisateur.name ? utilisateur.name.charAt(0).toUpperCase() : <i className="fas fa-user"></i>
          )}
        </div>
        <div>
          <p className="sidebar-name">{utilisateur.name}</p>
          <p className="sidebar-role">{utilisateur.role}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className={`fas ${link.icon} sidebar-icon`}></i>
            <span>{link.label}</span>
            {link.badge > 0 && (
              <span className="sidebar-badge">{link.badge > 99 ? '99+' : link.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
