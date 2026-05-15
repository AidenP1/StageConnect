import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { getMesCandidatures } from '../../api/candidatures';
import { getMesFavoris } from '../../api/favoris';
import { getMesNotifications } from '../../api/notifications';
import { formaterDate, getBadgeStatut, getLabelStatut } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

function EtudiantDashboard() {
  const { utilisateur } = useAuth();
  const { t } = useLang();

  const [candidatures, setCandidatures] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const candidaturesData = await getMesCandidatures();
        setCandidatures(candidaturesData);
      } catch (err) {
        // erreur silencieuse
      }

      try {
        const favorisData = await getMesFavoris();
        setFavoris(favorisData);
      } catch (err) {
        // erreur silencieuse
      }

      try {
        const notifData = await getMesNotifications();
        setNotifications(notifData);
      } catch (err) {
        // erreur silencieuse
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, []);

  const candidaturesAcceptees = candidatures.filter((c) => c.status === 'accepte').length;
  const notifsNonLues = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">
          {t('dashboard.welcome')}, {utilisateur?.name} !
        </h1>

        {/* cartes de stats */}
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="stat-card card-custom">
              <div className="stat-card-icon bg-primary text-white">
                <i className="fas fa-file-alt"></i>
              </div>
              <div>
                <p className="stat-card-number">{candidatures.length}</p>
                <p className="stat-card-label">{t('dashboard.totalCandidatures')}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="stat-card card-custom">
              <div className="stat-card-icon bg-success text-white">
                <i className="fas fa-check"></i>
              </div>
              <div>
                <p className="stat-card-number">{candidaturesAcceptees}</p>
                <p className="stat-card-label">{t('dashboard.acceptedCandidatures')}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="stat-card card-custom">
              <div className="stat-card-icon bg-danger text-white">
                <i className="fas fa-heart"></i>
              </div>
              <div>
                <p className="stat-card-number">{favoris.length}</p>
                <p className="stat-card-label">{t('dashboard.savedOffers')}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="stat-card card-custom">
              <div className="stat-card-icon bg-warning text-white">
                <i className="fas fa-bell"></i>
              </div>
              <div>
                <p className="stat-card-number">{notifsNonLues}</p>
                <p className="stat-card-label">{t('dashboard.unreadNotifs')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* candidatures récentes */}
        <div className="card-custom p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">{t('dashboard.recentCandidatures')}</h5>
            <Link to="/etudiant/candidatures" className="btn btn-sm btn-outline-primary">
              {t('dashboard.viewAll')}
            </Link>
          </div>

          {chargement ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary"></div>
            </div>
          ) : candidatures.length === 0 ? (
            <p className="text-muted">{t('candidatures.noCandidatures')}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>{t('candidatures.stageTitle')}</th>
                    <th>{t('candidatures.company')}</th>
                    <th>{t('candidatures.date')}</th>
                    <th>{t('candidatures.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatures.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td>{c.stage?.title}</td>
                      <td>{c.stage?.societe?.societe_profile?.company_name || c.stage?.societe?.name}</td>
                      <td>{formaterDate(c.created_at)}</td>
                      <td>
                        <span className={`badge bg-${getBadgeStatut(c.status)}`}>
                          {getLabelStatut(c.status, t)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Link to="/etudiant/stages" className="btn btn-primary">
          <i className="fas fa-search me-2"></i>
          {t('dashboard.browseStages')}
        </Link>
      </div>
    </div>
  );
}

export default EtudiantDashboard;
