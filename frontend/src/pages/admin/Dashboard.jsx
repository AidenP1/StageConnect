import { useState, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { getStatsAdmin, approuverUtilisateurAdmin } from '../../api/admin';
import { formaterDate } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';

function AdminDashboard() {
  const { t } = useLang();

  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getStatsAdmin();
        setStats(data);
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, []);

  const handleApprouver = async (id) => {
    try {
      await approuverUtilisateurAdmin(id, true);
      setStats((prev) => ({
        ...prev,
        societes_en_attente: prev.societes_en_attente.filter((s) => s.id !== id),
        en_attente_approbation: prev.en_attente_approbation - 1,
      }));
    } catch (err) {
      setErreur(t('errors.general'));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">{t('admin.title')}</h1>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <>
            {/* stats globales */}
            <div className="row g-3 mb-4">
              <div className="col-sm-6 col-xl-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-primary text-white"><i className="fas fa-users"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.total_utilisateurs}</p>
                    <p className="stat-card-label">Utilisateurs</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-success text-white"><i className="fas fa-graduation-cap"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.total_etudiants}</p>
                    <p className="stat-card-label">Étudiants</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-info text-white"><i className="fas fa-building"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.total_societes}</p>
                    <p className="stat-card-label">Sociétés</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-warning text-white"><i className="fas fa-briefcase"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.total_stages}</p>
                    <p className="stat-card-label">Stages</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-danger text-white"><i className="fas fa-file-alt"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.total_candidatures}</p>
                    <p className="stat-card-label">Candidatures</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-2">
                <div className="stat-card card-custom">
                  <div className="stat-card-icon bg-secondary text-white"><i className="fas fa-hourglass"></i></div>
                  <div>
                    <p className="stat-card-number">{stats?.en_attente_approbation}</p>
                    <p className="stat-card-label">En attente</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* inscriptions récentes */}
              <div className="col-lg-6">
                <div className="card-custom p-4">
                  <h5 className="mb-3">Inscriptions récentes</h5>
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Rôle</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.inscriptions_recentes?.map((u) => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>
                            <span className={`badge bg-${u.role === 'admin' ? 'danger' : u.role === 'societe' ? 'info' : 'success'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{formaterDate(u.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* sociétés en attente d'approbation */}
              <div className="col-lg-6">
                <div className="card-custom p-4">
                  <h5 className="mb-3">Sociétés en attente d'approbation</h5>
                  {stats?.societes_en_attente?.length === 0 ? (
                    <p className="text-muted">Aucune société en attente.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {stats?.societes_en_attente?.map((s) => (
                        <div key={s.id} className="d-flex justify-content-between align-items-center p-2" style={{ background: 'var(--bg-secondary)', borderRadius: 8 }}>
                          <div>
                            <strong>{s.name}</strong>
                            <br />
                            <small className="text-muted">{s.email}</small>
                          </div>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprouver(s.id)}
                          >
                            <i className="fas fa-check me-1"></i>
                            {t('admin.approve')}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
