import { useState, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { getMesFavoris, supprimerFavori } from '../../api/favoris';
import StageCard from '../../components/StageCard';
import Sidebar from '../../components/Sidebar';

function Favoris() {
  const { t } = useLang();

  const [favoris, setFavoris] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getMesFavoris();
        setFavoris(data);
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, []);

  const handleSupprimer = async (stageId) => {
    try {
      await supprimerFavori(stageId);
      setFavoris((prev) => prev.filter((f) => f.stage_id !== stageId));
    } catch (err) {
      setErreur(t('errors.general'));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">{t('nav.myFavoris')}</h1>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : favoris.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-heart fa-3x mb-3" style={{ color: 'var(--text-muted)' }}></i>
            <p className="text-muted">Aucun stage sauvegardé.</p>
          </div>
        ) : (
          <div className="row g-3">
            {favoris.map((favori) => (
              <div key={favori.id} className="col-md-6 col-lg-4">
                <div className="position-relative">
                  <StageCard stage={favori.stage} />
                  <button
                    className="btn btn-sm btn-danger position-absolute"
                    style={{ top: 8, right: 8 }}
                    onClick={() => handleSupprimer(favori.stage_id)}
                    title="Retirer des favoris"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoris;
