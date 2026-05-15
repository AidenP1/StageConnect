import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { getCandidaturesPourOffre } from '../../api/stages';
import { changerStatutCandidature } from '../../api/candidatures';
import { envoyerMessage } from '../../api/messages';
import { formaterDate, getBadgeStatut, getLabelStatut, getImageUrl } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';

function CandidaturesSociete() {
  const { id } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();

  const [offre, setOffre] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [profilModal, setProfilModal] = useState(null);
  const [contactEnvoi, setContactEnvoi] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getCandidaturesPourOffre(id);
        setOffre(data.offre);
        setCandidatures(data.candidatures);
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, [id]);

  const handleStatut = async (candidatureId, statut) => {
    try {
      await changerStatutCandidature(candidatureId, statut);
      setCandidatures((prev) =>
        prev.map((c) => (c.id === candidatureId ? { ...c, status: statut } : c))
      );
    } catch (err) {
      setErreur(t('errors.general'));
    }
  };

  const handleContact = async (candidature) => {
    const etudiantId = candidature.etudiant?.id || candidature.etudiant_id;
    if (!etudiantId) return;
    setContactEnvoi(true);
    try {
      await envoyerMessage(
        etudiantId,
        `Bonjour ${candidature.etudiant?.name || ''}, concernant votre candidature pour le stage "${offre?.title}".`,
        offre?.id
      );
      navigate(`/societe/messages/${etudiantId}`);
    } catch (err) {
      setErreur(t('errors.general'));
    } finally {
      setContactEnvoi(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">
          {t('candidatures.forOffer')} {offre?.title}
        </h1>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : candidatures.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">{t('candidatures.noneForOffer')}</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {candidatures.map((c) => (
              <div key={c.id} className="card-custom p-4">
                <div className="row g-3 align-items-center">
                  <div className="col-md-4">
                    <h6 className="mb-1">{c.etudiant?.name}</h6>
                    <small className="text-muted">
                      {c.etudiant?.etudiant_profile?.filiere || '-'}
                    </small>
                    <br />
                    <small className="text-muted">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {c.etudiant?.etudiant_profile?.city || '-'}
                    </small>
                  </div>

                  <div className="col-md-3">
                    <small className="text-muted d-block">{formaterDate(c.created_at)}</small>
                    <span className={`badge bg-${getBadgeStatut(c.status)}`}>
                      {getLabelStatut(c.status, t)}
                    </span>
                  </div>

                  <div className="col-md-5">
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setProfilModal(c)}
                      >
                        <i className="fas fa-eye me-1"></i>
                        {t('common.viewProfile')}
                      </button>

                      {c.etudiant?.etudiant_profile?.cv_path && (
                        <a
                          href={getImageUrl(c.etudiant.etudiant_profile.cv_path)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <i className="fas fa-download me-1"></i>
                          CV
                        </a>
                      )}
                      {c.cover_letter_path && (
                        <a
                          href={getImageUrl(c.cover_letter_path)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="fas fa-file-alt me-1"></i>
                          Lettre
                        </a>
                      )}

                      {c.status === 'en_attente' && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatut(c.id, 'accepte')}
                          >
                            <i className="fas fa-check me-1"></i>
                            {t('common.accept')}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleStatut(c.id, 'refuse')}
                          >
                            <i className="fas fa-times me-1"></i>
                            {t('common.refuse')}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {c.cover_letter && (
                  <div className="mt-3 p-3" style={{ background: 'var(--bg-secondary)', borderRadius: 8 }}>
                    <small className="text-muted">{t('candidatures.coverLetterLabel')}</small>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginTop: 4 }}>{c.cover_letter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* modal profil */}
        {profilModal && (
          <div className="modal-overlay" onClick={() => setProfilModal(null)}>
            <div className="modal-box card-custom" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
              {/* en-tête */}
              <div className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.3rem', flexShrink: 0 }}>
                  {(profilModal.etudiant?.name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="mb-0" style={{ color: 'var(--text)' }}>{profilModal.etudiant?.name}</h5>
                  <small style={{ color: 'var(--text-muted)' }}>{profilModal.etudiant?.email}</small>
                </div>
              </div>

              {/* infos */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('admin.colFiliere')}</small>
                  <p style={{ margin: 0, color: 'var(--text)', fontWeight: 500 }}>{profilModal.etudiant?.etudiant_profile?.filiere || '—'}</p>
                </div>
                <div className="col-6">
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('admin.colCity')}</small>
                  <p style={{ margin: 0, color: 'var(--text)', fontWeight: 500 }}>{profilModal.etudiant?.etudiant_profile?.city || '—'}</p>
                </div>
              </div>

              {profilModal.etudiant?.etudiant_profile?.skills && (
                <div className="mb-3">
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('admin.colSkills')}</small>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {profilModal.etudiant.etudiant_profile.skills.split(',').map((s, i) => (
                      <span key={i} style={{ background: 'var(--primary)', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 500 }}>{s.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {profilModal.etudiant?.etudiant_profile?.bio && (
                <div className="mb-3">
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('admin.colBio')}</small>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6 }}>{profilModal.etudiant.etudiant_profile.bio}</p>
                </div>
              )}

              {/* actions CV + lettre + portfolio */}
              <div className="d-flex gap-2 flex-wrap mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                {profilModal.etudiant?.etudiant_profile?.cv_path ? (
                  <a href={getImageUrl(profilModal.etudiant.etudiant_profile.cv_path)} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                    <i className="fas fa-file-pdf me-1"></i> CV
                  </a>
                ) : (
                  <span className="btn btn-sm btn-outline-secondary disabled">
                    <i className="fas fa-file-pdf me-1"></i> Pas de CV
                  </span>
                )}
                {profilModal.cover_letter_path ? (
                  <a href={getImageUrl(profilModal.cover_letter_path)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-file-alt me-1"></i> Lettre de motivation
                  </a>
                ) : (
                  <span className="btn btn-sm btn-outline-secondary disabled">
                    <i className="fas fa-file-alt me-1"></i> Pas de lettre
                  </span>
                )}
                {profilModal.etudiant?.etudiant_profile?.portfolio_url && (
                  <a href={profilModal.etudiant.etudiant_profile.portfolio_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success">
                    <i className="fas fa-globe me-1"></i> Portfolio
                  </a>
                )}
                <button className="btn btn-sm btn-success" onClick={() => handleContact(profilModal)} disabled={contactEnvoi}>
                  {contactEnvoi ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="fas fa-comment-alt me-1"></i>}
                  {t('candidatures.contact')}
                </button>
                <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={() => setProfilModal(null)}>
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidaturesSociete;
