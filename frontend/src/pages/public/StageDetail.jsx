import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { getDetailStage } from '../../api/public';
import { postuler } from '../../api/candidatures';
import { ajouterFavori, supprimerFavori, getMesFavoris } from '../../api/favoris';
import { envoyerMessage } from '../../api/messages';
import { formaterDate, getImageUrl } from '../../utils/helpers';
import RatingStars from '../../components/RatingStars';
import Footer from '../../components/Footer';
import './StageDetail.css';

function StageDetail() {
  const { id } = useParams();
  const { t } = useLang();
  const { utilisateur } = useAuth();
  const navigate = useNavigate();

  const [stage, setStage] = useState(null);
  const [noteMoyenne, setNoteMoyenne] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [modalPostuler, setModalPostuler] = useState(false);
  const [lettreMotivation, setLettreMotivation] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState('');
  const [estFavori, setEstFavori] = useState(false);

  // charger les détails du stage
  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getDetailStage(id);
        setStage(data.stage);
        setNoteMoyenne(data.note_moyenne || 0);
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, [id]);

  // vérifier si dans les favoris
  useEffect(() => {
    if (utilisateur && utilisateur.role === 'etudiant') {
      const verifierFavori = async () => {
        try {
          const favoris = await getMesFavoris();
          const found = favoris.some((f) => f.stage_id === parseInt(id));
          setEstFavori(found);
        } catch (err) {
          // ignorer
        }
      };
      verifierFavori();
    }
  }, [id, utilisateur]);

  const handlePostuler = async () => {
    if (!utilisateur) {
      navigate('/login');
      return;
    }
    setModalPostuler(true);
  };

  const envoyerCandidature = async () => {
    setEnvoi(true);
    try {
      await postuler(id, lettreMotivation);
      setMessageSuccess(t('stageDetail.applicationSent'));
      setModalPostuler(false);
      setLettreMotivation('');
    } catch (err) {
      setErreur(err.response?.data?.message || t('errors.general'));
    } finally {
      setEnvoi(false);
    }
  };

  const handleFavori = async () => {
    if (!utilisateur) {
      navigate('/login');
      return;
    }

    try {
      if (estFavori) {
        await supprimerFavori(id);
        setEstFavori(false);
      } else {
        await ajouterFavori(id);
        setEstFavori(true);
      }
    } catch (err) {
      // ignorer si déjà favori
    }
  };

  if (chargement) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (erreur && !stage) {
    return <div className="container py-5"><div className="alert alert-danger">{erreur}</div></div>;
  }

  const nomEntreprise = stage?.societe?.societe_profile?.company_name || stage?.societe?.name;
  const logoUrl = stage?.societe?.societe_profile?.logo_path
    ? getImageUrl(stage.societe.societe_profile.logo_path)
    : null;

  return (
    <div>
      <div className="container py-4">
        <Link to="/stages" className="btn btn-outline-secondary btn-sm mb-3">
          <i className="fas fa-arrow-left me-2"></i>
          {t('stageDetail.backToOffers')}
        </Link>

        {messageSuccess && (
          <div className="alert alert-success">{messageSuccess}</div>
        )}

        {stage && (
          <div className="row g-4">
            {/* colonne principale */}
            <div className="col-lg-8">
              <div className="card-custom p-4">
                <div className="stage-detail-header mb-3">
                  <div className="d-flex align-items-center gap-3">
                    {logoUrl ? (
                      <img src={logoUrl} alt={nomEntreprise} className="detail-logo" />
                    ) : (
                      <div className="detail-logo-placeholder">
                        <i className="fas fa-building"></i>
                      </div>
                    )}
                    <div>
                      <h1 className="detail-title">{stage.title}</h1>
                      <Link to={`/entreprises/${stage.societe_id}`} className="detail-company">
                        {nomEntreprise}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="detail-meta mb-4">
                  {stage.city && (
                    <span className="meta-item">
                      <i className="fas fa-map-marker-alt me-1 text-primary"></i> {stage.city}
                    </span>
                  )}
                  {stage.sector && (
                    <span className="meta-item">
                      <i className="fas fa-industry me-1 text-primary"></i> {stage.sector}
                    </span>
                  )}
                  {stage.duration && (
                    <span className="meta-item">
                      <i className="fas fa-clock me-1 text-primary"></i> {stage.duration}
                    </span>
                  )}
                  {stage.deadline && (
                    <span className="meta-item">
                      <i className="fas fa-calendar me-1 text-primary"></i>
                      {t('stages.deadline')}: {formaterDate(stage.deadline)}
                    </span>
                  )}
                  <span className="meta-item text-muted">
                    <i className="fas fa-eye me-1"></i> {stage.views_count} {t('stages.viewsCount')}
                  </span>
                </div>

                <h4>{t('stageDetail.description')}</h4>
                <p className="mb-4" style={{ lineHeight: 1.7, color: 'var(--text)' }}>{stage.description}</p>

                {stage.tasks && (
                  <>
                    <h4>{t('stageDetail.tasks')}</h4>
                    <p className="mb-4" style={{ lineHeight: 1.7, color: 'var(--text)' }}>{stage.tasks}</p>
                  </>
                )}

                {stage.skills_required && (
                  <>
                    <h4>{t('stageDetail.skills')}</h4>
                    <div className="skills-list mb-4">
                      {stage.skills_required.split(',').map((skill, i) => (
                        <span key={i} className="skill-badge">{skill.trim()}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* colonne latérale */}
            <div className="col-lg-4">
              <div className="card-custom p-4 sticky-sidebar">
                <h5 className="mb-3">{t('stageDetail.actions')}</h5>

                {noteMoyenne > 0 && (
                  <div className="mb-3">
                    <small className="text-muted">{t('stageDetail.companyRating')}</small>
                    <div><RatingStars note={noteMoyenne} /></div>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handlePostuler}
                    title={!utilisateur ? t('stages.loginToApply') : ''}
                  >
                    {!utilisateur && <i className="fas fa-lock me-2"></i>}
                    {t('stageDetail.applyBtn')}
                  </button>

                  {utilisateur && utilisateur.role === 'etudiant' && (
                    <button
                      className={`btn ${estFavori ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={handleFavori}
                    >
                      <i className={`fa${estFavori ? 's' : 'r'} fa-heart me-2`}></i>
                      {estFavori ? t('stageDetail.removeFavorite') : t('stageDetail.saveBtn')}
                    </button>
                  )}

                  {utilisateur && utilisateur.role === 'etudiant' && (
                    <button
                      className="btn btn-outline-success"
                      onClick={async () => {
                        await envoyerMessage(stage.societe_id, `Bonjour, je suis intéressé par votre offre "${stage.title}".`, stage.id);
                        navigate(`/etudiant/messages/${stage.societe_id}`);
                      }}
                    >
                      <i className="fas fa-comment-alt me-2"></i>
                      {t('stageDetail.contactCompany')}
                    </button>
                  )}

                  <Link to={`/entreprises/${stage.societe_id}`} className="btn btn-outline-secondary">
                    <i className="fas fa-building me-2"></i>
                    {t('stageDetail.viewCompany')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* modal postuler */}
        {modalPostuler && (
          <div className="modal-overlay" onClick={() => setModalPostuler(false)}>
            <div className="modal-box card-custom" onClick={(e) => e.stopPropagation()}>
              <h5 className="mb-3">{t('stageDetail.coverLetter')}</h5>
              <textarea
                className="form-control mb-3"
                rows="5"
                placeholder={t('stageDetail.coverLetterPlaceholder')}
                value={lettreMotivation}
                onChange={(e) => setLettreMotivation(e.target.value)}
              />
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-outline-secondary" onClick={() => setModalPostuler(false)}>
                  {t('stageDetail.cancel')}
                </button>
                <button className="btn btn-primary" onClick={envoyerCandidature} disabled={envoi}>
                  {envoi ? '...' : t('stageDetail.sendApplication')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default StageDetail;
