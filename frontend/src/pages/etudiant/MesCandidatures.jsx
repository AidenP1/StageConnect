import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { getMesCandidatures } from '../../api/candidatures';
import { formaterDate, getBadgeStatut, getLabelStatut } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';

function MesCandidatures() {
  const { t } = useLang();

  const [candidatures, setCandidatures] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getMesCandidatures();
        setCandidatures(data);
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">{t('candidatures.title')}</h1>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : candidatures.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-file-alt fa-3x mb-3" style={{ color: 'var(--text-muted)' }}></i>
            <p className="text-muted">{t('candidatures.noCandidatures')}</p>
            <Link to="/etudiant/stages" className="btn btn-primary mt-2">
              {t('candidatures.browseStages')}
            </Link>
          </div>
        ) : (
          <div className="card-custom">
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
                  {candidatures.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <Link to={`/stages/${c.stage_id}`}>{c.stage?.title}</Link>
                      </td>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default MesCandidatures;
