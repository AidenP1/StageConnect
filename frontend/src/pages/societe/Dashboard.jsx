import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { getMesStats } from '../../api/societe';
import { getCandidaturesPourOffre } from '../../api/stages';
import { changerStatutCandidature } from '../../api/candidatures';
import { getMesOffres } from '../../api/stages';
import { formaterDate, getBadgeStatut, getLabelStatut } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';

function SocieteDashboard() {
  const { utilisateur } = useAuth();
  const { t } = useLang();

  const [stats, setStats] = useState(null);
  const [offres, setOffres] = useState([]);
  const [candidaturesRecentes, setCandidaturesRecentes] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const statsData = await getMesStats();
        setStats(statsData);

        const offresData = await getMesOffres();
        setOffres(offresData);

        // récupérer les candidatures de la première offre
        if (offresData.length > 0) {
          const candData = await getCandidaturesPourOffre(offresData[0].id);
          setCandidaturesRecentes(candData.candidatures || []);
        }
      } catch (err) {
        // erreur silencieuse
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, []);

  const handleStatut = async (candidatureId, statut) => {
    try {
      await changerStatutCandidature(candidatureId, statut);
      setCandidaturesRecentes((prev) =>
        prev.map((c) => (c.id === candidatureId ? { ...c, status: statut } : c))
      );
    } catch (err) {
      // ignorer
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">
          {t('dashboard.welcome')}, {utilisateur?.name} !
        </h1>

        {/* stats */}
        <div className="row g-3 mb-4">
          <div className="col-sm-4">
            <div className="stat-card card-custom">
              <div className="stat-card-icon bg-primary text-white">
                <i className="fas fa-list"></i>
              </div>
              <div>
                <p className="stat-card-number">{stats?.total_offres || 0}</p>
                <p className="stat-card-label">{t('dashboard.totalOffers')}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="stat-card card-custom">
              <div className="stat-card-icon bg-success text-white">
                <i className="fas fa-users"></i>
              </div>
              <div>
                <p className="stat-card-number">{stats?.total_candidatures || 0}</p>
                <p className="stat-card-label">{t('dashboard.totalApplications')}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="stat-card card-custom">
              <div className="stat-card-icon bg-warning text-white">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div>
                <p className="stat-card-number">{stats?.en_attente || 0}</p>
                <p className="stat-card-label">{t('dashboard.pendingApplications')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* candidatures récentes */}
        {candidaturesRecentes.length > 0 && (
          <div className="card-custom p-4 mb-4">
            <h5 className="mb-3">{t('dashboard.recentApplications')}</h5>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>{t('dashboard.colStudent')}</th>
                    <th>{t('dashboard.colFiliere')}</th>
                    <th>{t('dashboard.colDate')}</th>
                    <th>{t('dashboard.colStatus')}</th>
                    <th>{t('dashboard.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {candidaturesRecentes.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td>{c.etudiant?.name}</td>
                      <td>{c.etudiant?.etudiant_profile?.filiere || '-'}</td>
                      <td>{formaterDate(c.created_at)}</td>
                      <td>
                        <span className={`badge bg-${getBadgeStatut(c.status)}`}>
                          {getLabelStatut(c.status, t)}
                        </span>
                      </td>
                      <td>
                        {c.status === 'en_attente' && (
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleStatut(c.id, 'accepte')}
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleStatut(c.id, 'refuse')}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Link to="/societe/offres/nouvelle" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          {t('dashboard.quickPost')}
        </Link>
      </div>
    </div>
  );
}

export default SocieteDashboard;
