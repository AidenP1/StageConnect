import { useState, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { getStagesPublics } from '../../api/public';
import { postuler, getMesCandidatures } from '../../api/candidatures';
import { ajouterFavori, supprimerFavori, getMesFavoris } from '../../api/favoris';
import StageCard from '../../components/StageCard';
import Sidebar from '../../components/Sidebar';

function EtudiantStages() {
  const { t } = useLang();

  const [stages, setStages] = useState([]);
  const [stagesFiltres, setStagesFiltres] = useState([]);
  const [favorisIds, setFavorisIds] = useState([]);
  const [candidaturesIds, setCandidaturesIds] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');
  const [modalPostuler, setModalPostuler] = useState(null);
  const [fichierLettre, setFichierLettre] = useState(null);
  const [pageCourante, setPageCourante] = useState(1);

  const [filtres, setFiltres] = useState({ search: '', sector: '', city: '' });
  const stagesParPage = 9;

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getStagesPublics();
        setStages(data.data || []);

        const favorisData = await getMesFavoris();
        setFavorisIds(favorisData.map((f) => f.stage_id));

        const candidaturesData = await getMesCandidatures();
        setCandidaturesIds(candidaturesData.map((c) => c.stage_id));
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, []);

  useEffect(() => {
    let resultat = [...stages];

    if (filtres.search) {
      const mot = filtres.search.toLowerCase();
      resultat = resultat.filter(
        (s) => s.title.toLowerCase().includes(mot) || s.city?.toLowerCase().includes(mot)
      );
    }
    if (filtres.sector) resultat = resultat.filter((s) => s.sector === filtres.sector);
    if (filtres.city) resultat = resultat.filter((s) => s.city === filtres.city);

    setStagesFiltres(resultat);
    setPageCourante(1);
  }, [filtres, stages]);

  const handlePostuler = async () => {
    if (!modalPostuler) return;
    try {
      await postuler(modalPostuler.id, fichierLettre);
      setCandidaturesIds((prev) => [...prev, modalPostuler.id]);
      setMessageSuccess('Candidature envoyée !');
      setModalPostuler(null);
      setFichierLettre(null);
      setTimeout(() => setMessageSuccess(''), 3000);
    } catch (err) {
      setErreur(err.response?.data?.message || t('errors.general'));
    }
  };

  const handleToggleFavori = async (stageId) => {
    try {
      if (favorisIds.includes(stageId)) {
        await supprimerFavori(stageId);
        setFavorisIds((prev) => prev.filter((id) => id !== stageId));
      } else {
        await ajouterFavori(stageId);
        setFavorisIds((prev) => [...prev, stageId]);
      }
    } catch (err) {
      // ignorer
    }
  };

  const secteurs = [...new Set(stages.map((s) => s.sector).filter(Boolean))];
  const villes = [...new Set(stages.map((s) => s.city).filter(Boolean))];
  const totalPages = Math.ceil(stagesFiltres.length / stagesParPage);
  const stagesPage = stagesFiltres.slice((pageCourante - 1) * stagesParPage, pageCourante * stagesParPage);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">{t('stages.title')}</h1>

        {messageSuccess && <div className="alert alert-success">{messageSuccess}</div>}
        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {/* filtres */}
        <div className="card-custom p-3 mb-4">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder={t('stages.search')}
                value={filtres.search}
                onChange={(e) => setFiltres((p) => ({ ...p, search: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filtres.sector}
                onChange={(e) => setFiltres((p) => ({ ...p, sector: e.target.value }))}
              >
                <option value="">{t('stages.allSectors')}</option>
                {secteurs.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filtres.city}
                onChange={(e) => setFiltres((p) => ({ ...p, city: e.target.value }))}
              >
                <option value="">{t('stages.allCities')}</option>
                {villes.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {chargement ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <>
            <div className="row g-3">
              {stagesPage.map((stage) => (
                <div key={stage.id} className="col-md-6 col-lg-4">
                  <StageCard
                    stage={stage}
                    onPostuler={candidaturesIds.includes(stage.id) ? null : (s) => setModalPostuler(s)}
                    onToggleFavori={handleToggleFavori}
                    estFavori={favorisIds.includes(stage.id)}
                    dejaPostule={candidaturesIds.includes(stage.id)}
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={pageCourante === 1}
                  onClick={() => setPageCourante((p) => p - 1)}
                >
                  {t('common.previous')}
                </button>
                <span className="d-flex align-items-center px-3 text-muted">
                  {pageCourante} / {totalPages}
                </span>
                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={pageCourante === totalPages}
                  onClick={() => setPageCourante((p) => p + 1)}
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}

        {/* modal postuler */}
        {modalPostuler && (
          <div className="modal-overlay" onClick={() => { setModalPostuler(null); setFichierLettre(null); }}>
            <div className="modal-box card-custom" onClick={(e) => e.stopPropagation()}>
              <h5 className="mb-1">{t('stageDetail.coverLetter')}</h5>
              <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>{modalPostuler.title}</p>
              <div className="mb-3">
                <label className="form-label" style={{ color: 'var(--text)', fontWeight: 500 }}>
                  <i className="fas fa-file-alt me-2 text-primary"></i>
                  {t('stageDetail.coverLetter')} <span className="text-muted fw-normal">(PDF, DOC, DOCX — optionnel)</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFichierLettre(e.target.files[0] || null)}
                />
                {fichierLettre && (
                  <small className="text-success mt-1 d-block">
                    <i className="fas fa-check me-1"></i>{fichierLettre.name}
                  </small>
                )}
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-outline-secondary" onClick={() => { setModalPostuler(null); setFichierLettre(null); }}>
                  {t('common.cancel')}
                </button>
                <button className="btn btn-primary" onClick={handlePostuler}>
                  {t('stageDetail.sendApplication')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EtudiantStages;
