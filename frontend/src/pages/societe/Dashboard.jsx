import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { getMesStats, getCandidaturesRecentes } from '../../api/societe';
import { getMesOffres, getCandidaturesPourOffre } from '../../api/stages';
import { changerStatutCandidature } from '../../api/candidatures';
import { formaterDate, getBadgeStatut, getLabelStatut } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';

function SocieteDashboard() {
  const { utilisateur } = useAuth();
  const { t } = useLang();

  const [stats, setStats] = useState(null);
  const [candidaturesRecentes, setCandidaturesRecentes] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const statsData = await getMesStats();
        setStats(statsData);
      } catch (err) {}

      try {
        // try new endpoint first, fall back to aggregating from all offers
        let candData = await getCandidaturesRecentes().catch(() => null);
        if (!candData || candData.length === 0) {
          const offresData = await getMesOffres();
          const results = await Promise.all(
            offresData.map((o) => getCandidaturesPourOffre(o.id).then((d) => d.candidatures || []).catch(() => []))
          );
          candData = results.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
        }
        setCandidaturesRecentes(candData);
      } catch (err) {}

      setChargement(false);
    };
    charger();
  }, []);

  const handleStatut = async (candidatureId, statut) => {
    try {
      await changerStatutCandidature(candidatureId, statut);
      setCandidaturesRecentes((prev) =>
        prev.map((c) => (c.id === candidatureId ? { ...c, status: statut } : c))
      );
    } catch (err) {}
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
        <div className="card-custom p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">{t('dashboard.recentApplications')}</h5>
          </div>

          {chargement ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary"></div>
            </div>
          ) : candidaturesRecentes.length === 0 ? (
            <p className="text-muted">{t('candidatures.noneForOffer')}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ minWidth: 600 }}>
                <thead>
                  <tr>
                    <th>{t('dashboard.colStudent')}</th>
                    <th>{t('candidatures.stageTitle')}</th>
                    <th>{t('dashboard.colFiliere')}</th>
                    <th>{t('dashboard.colDate')}</th>
                    <th>{t('dashboard.colStatus')}</th>
                    <th>{t('dashboard.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {candidaturesRecentes.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong style={{ color: 'var(--text)' }}>{c.etudiant?.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.etudiant?.email}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{c.stage?.title}</td>
                      <td style={{ fontSize: '0.85rem' }}>{c.etudiant?.etudiant_profile?.filiere || '—'}</td>
                      <td style={{ fontSize: '0.85rem' }}>{formaterDate(c.created_at)}</td>
                      <td>
                        <span className={`badge bg-${getBadgeStatut(c.status)}`}>
                          {getLabelStatut(c.status, t)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <Link
                            to={`/societe/offres/${c.stage_id}/candidatures`}
                            className="btn btn-sm btn-outline-info"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          {c.status === 'en_attente' && (
                            <>
                              <button className="btn btn-sm btn-success" onClick={() => handleStatut(c.id, 'accepte')}>
                                <i className="fas fa-check"></i>
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleStatut(c.id, 'refuse')}>
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Link to="/societe/offres/nouvelle" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          {t('dashboard.quickPost')}
        </Link>
      </div>
    </div>
  );
}

export default SocieteDashboard;
