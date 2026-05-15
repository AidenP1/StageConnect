import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { getStatsPubliques, getDernieresOffres } from '../../api/public';
import StageCard from '../../components/StageCard';
import Footer from '../../components/Footer';
import './Landing.css';

function Landing() {
  const { t } = useLang();
  const { utilisateur } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ total_stages: 0, total_entreprises: 0, total_etudiants: 0 });
  const [dernieresOffres, setDernieresOffres] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);

  // récupérer les stats et les dernières offres au chargement
  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const statsData = await getStatsPubliques();
        setStats(statsData);
      } catch (err) {
        // ignorer les erreurs de stats
      }

      try {
        const offresData = await getDernieresOffres();
        setDernieresOffres(offresData);
      } catch (err) {
        // ignorer les erreurs d'offres
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, []);

  const handleRecherche = (e) => {
    e.preventDefault();
    if (recherche.trim()) {
      navigate(`/stages?search=${encodeURIComponent(recherche)}`);
    } else {
      navigate('/stages');
    }
  };

  return (
    <div className="landing-page">
      {/* section hero */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{t('landing.heroTitle')}</h1>
            <p className="hero-subtitle">{t('landing.heroSubtitle')}</p>

            <form className="hero-search" onSubmit={handleRecherche}>
              <input
                type="text"
                className="form-control hero-search-input"
                placeholder={t('landing.searchPlaceholder')}
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              <button type="submit" className="btn btn-primary hero-search-btn">
                <i className="fas fa-search me-2"></i>
                {t('landing.searchBtn')}
              </button>
            </form>

            <div className="hero-cta">
              <Link to="/stages" className="btn btn-primary btn-lg">
                <i className="fas fa-search me-2"></i>
                {t('landing.viewOffers')}
              </Link>
              {utilisateur?.role !== 'etudiant' && (
                <Link to={utilisateur?.role === 'societe' ? '/societe/offres/nouvelle' : '/register'} className="btn btn-outline-light btn-lg">
                  <i className="fas fa-plus me-2"></i>
                  {t('landing.publishStage')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* barre de stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="row g-3 justify-content-center">
            <div className="col-sm-4">
              <div className="stat-item">
                <span className="stat-number">{stats.total_stages}</span>
                <span className="stat-label">{t('landing.totalOffers')}</span>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="stat-item">
                <span className="stat-number">{stats.total_entreprises}</span>
                <span className="stat-label">{t('landing.totalCompanies')}</span>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="stat-item">
                <span className="stat-number">{stats.total_etudiants}</span>
                <span className="stat-label">{t('landing.totalStudents')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* dernières offres */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">{t('landing.recentOffers')}</h2>
          {chargement ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {dernieresOffres.map((stage) => (
                <div key={stage.id} className="col-md-6 col-lg-4 d-flex">
                  <StageCard stage={stage} />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/stages" className="btn btn-outline-primary">
              Voir toutes les offres <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* comment ça fonctionne */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">{t('landing.howItWorks')}</h2>

          <div className="row g-4">
            {/* pour les étudiants */}
            <div className="col-md-6">
              <div className="how-card card-custom">
                <h4 className="how-card-title">
                  <i className="fas fa-graduation-cap me-2 text-primary"></i>
                  {t('landing.forStudents')}
                </h4>
                <div className="how-steps">
                  <div className="how-step">
                    <span className="step-number">1</span>
                    <span>{t('landing.step1Student')}</span>
                  </div>
                  <div className="how-step">
                    <span className="step-number">2</span>
                    <span>{t('landing.step2Student')}</span>
                  </div>
                  <div className="how-step">
                    <span className="step-number">3</span>
                    <span>{t('landing.step3Student')}</span>
                  </div>
                </div>
                <Link to="/register" className="btn btn-primary mt-3">
                  {t('nav.register')}
                </Link>
              </div>
            </div>

            {/* pour les entreprises */}
            <div className="col-md-6">
              <div className="how-card card-custom">
                <h4 className="how-card-title">
                  <i className="fas fa-building me-2 text-primary"></i>
                  {t('landing.forCompanies')}
                </h4>
                <div className="how-steps">
                  <div className="how-step">
                    <span className="step-number">1</span>
                    <span>{t('landing.step1Company')}</span>
                  </div>
                  <div className="how-step">
                    <span className="step-number">2</span>
                    <span>{t('landing.step2Company')}</span>
                  </div>
                  <div className="how-step">
                    <span className="step-number">3</span>
                    <span>{t('landing.step3Company')}</span>
                  </div>
                </div>
                <Link to="/register" className="btn btn-outline-primary mt-3">
                  {t('landing.publishStage')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
