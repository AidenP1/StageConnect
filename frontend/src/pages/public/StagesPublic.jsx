import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { getStagesPublics } from '../../api/public';
import StageCard from '../../components/StageCard';
import Footer from '../../components/Footer';
import './StagesPublic.css';

// TODO: ajouter la pagination plus tard

function StagesPublic() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();

  const [stages, setStages] = useState([]);
  const [stagesFiltres, setStagesFiltres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [pageCourante, setPageCourante] = useState(1);

  const [filtres, setFiltres] = useState({
    search: searchParams.get('search') || '',
    sector: '',
    city: '',
    duration: '',
  });

  const stagesParPage = 9;

  // récupérer tous les stages depuis l'API
  useEffect(() => {
    const chargerStages = async () => {
      setChargement(true);
      try {
        const data = await getStagesPublics();
        setStages(data.data || []);
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };

    chargerStages();
  }, []);

  // filtrer les stages sur le frontend
  useEffect(() => {
    let resultat = [...stages];

    if (filtres.search) {
      const mot = filtres.search.toLowerCase();
      resultat = resultat.filter(
        (s) =>
          s.title.toLowerCase().includes(mot) ||
          s.description.toLowerCase().includes(mot) ||
          (s.city && s.city.toLowerCase().includes(mot))
      );
    }

    if (filtres.sector) {
      resultat = resultat.filter((s) => s.sector === filtres.sector);
    }

    if (filtres.city) {
      resultat = resultat.filter((s) => s.city === filtres.city);
    }

    if (filtres.duration) {
      resultat = resultat.filter((s) =>
        s.duration && s.duration.toLowerCase().includes(filtres.duration.toLowerCase())
      );
    }

    setStagesFiltres(resultat);
    setPageCourante(1);
  }, [filtres, stages]);

  const handleFiltreChange = (e) => {
    const { name, value } = e.target;
    setFiltres((prev) => ({ ...prev, [name]: value }));
  };

  // pagination
  const totalPages = Math.ceil(stagesFiltres.length / stagesParPage);
  const stagesPage = stagesFiltres.slice(
    (pageCourante - 1) * stagesParPage,
    pageCourante * stagesParPage
  );

  // extraire les secteurs et villes uniques pour les selects
  const secteurs = [...new Set(stages.map((s) => s.sector).filter(Boolean))];
  const villes = [...new Set(stages.map((s) => s.city).filter(Boolean))];

  return (
    <div>
      <div className="stages-public-page">
        <div className="container py-4">
          <h1 className="stages-title">{t('stages.title')}</h1>

          {/* zone de filtres */}
          <div className="filtres-zone card-custom p-3 mb-4">
            <div className="row g-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="search"
                  placeholder={t('stages.search')}
                  value={filtres.search}
                  onChange={handleFiltreChange}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  name="sector"
                  value={filtres.sector}
                  onChange={handleFiltreChange}
                >
                  <option value="">{t('stages.allSectors')}</option>
                  {secteurs.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  name="city"
                  value={filtres.city}
                  onChange={handleFiltreChange}
                >
                  <option value="">{t('stages.allCities')}</option>
                  {villes.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  name="duration"
                  placeholder={t('stages.duration')}
                  value={filtres.duration}
                  onChange={handleFiltreChange}
                />
              </div>
            </div>
          </div>

          {erreur && (
            <div className="alert alert-danger">{erreur}</div>
          )}

          {chargement ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : stagesPage.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x mb-3" style={{ color: 'var(--text-muted)' }}></i>
              <p className="text-muted">{t('stages.noResults')}</p>
            </div>
          ) : (
            <>
              <p className="resultat-count text-muted mb-3">
                {stagesFiltres.length} offre(s) trouvée(s)
              </p>
              <div className="row g-3">
                {stagesPage.map((stage) => (
                  <div key={stage.id} className="col-md-6 col-lg-4">
                    <StageCard stage={stage} />
                  </div>
                ))}
              </div>

              {/* pagination */}
              {totalPages > 1 && (
                <div className="pagination-zone mt-4 d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={pageCourante === 1}
                    onClick={() => setPageCourante((p) => p - 1)}
                  >
                    <i className="fas fa-chevron-left me-1"></i>
                    {t('common.previous')}
                  </button>
                  <span className="pagination-info d-flex align-items-center px-3">
                    {pageCourante} / {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={pageCourante === totalPages}
                    onClick={() => setPageCourante((p) => p + 1)}
                  >
                    {t('common.next')}
                    <i className="fas fa-chevron-right ms-1"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StagesPublic;
