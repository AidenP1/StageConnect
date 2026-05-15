import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { getMesOffres, supprimerOffre } from '../../api/stages';
import { formaterDate } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';

function MesOffres() {
  const { t } = useLang();

  const [offres, setOffres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getMesOffres();
        setOffres(data);
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, []);

  const handleSupprimer = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await supprimerOffre(id);
      setOffres((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      setErreur(t('errors.general'));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="dashboard-title mb-0">{t('nav.myOffers')}</h1>
          <Link to="/societe/offres/nouvelle" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            {t('nav.newOffer')}
          </Link>
        </div>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : offres.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-list fa-3x mb-3" style={{ color: 'var(--text-muted)' }}></i>
            <p className="text-muted">{t('mesOffres.noOffers')}</p>
            <Link to="/societe/offres/nouvelle" className="btn btn-primary mt-2">
              {t('mesOffres.publishBtn')}
            </Link>
          </div>
        ) : (
          <div className="card-custom">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>{t('mesOffres.colTitle')}</th>
                    <th>{t('mesOffres.colCity')}</th>
                    <th>{t('mesOffres.colApplications')}</th>
                    <th>{t('mesOffres.colViews')}</th>
                    <th>{t('mesOffres.colDeadline')}</th>
                    <th>{t('mesOffres.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {offres.map((offre) => (
                    <tr key={offre.id}>
                      <td>{offre.title}</td>
                      <td>{offre.city}</td>
                      <td>
                        <span className="badge bg-primary">{offre.candidatures_count}</span>
                      </td>
                      <td>{offre.views_count}</td>
                      <td>{formaterDate(offre.deadline)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link
                            to={`/societe/offres/${offre.id}/modifier`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <Link
                            to={`/societe/offres/${offre.id}/candidatures`}
                            className="btn btn-sm btn-outline-success"
                          >
                            <i className="fas fa-users"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleSupprimer(offre.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MesOffres;
