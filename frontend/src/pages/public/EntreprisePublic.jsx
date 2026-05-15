import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { getProfilEntreprise } from '../../api/public';
import { envoyerMessage } from '../../api/messages';
import { getImageUrl, formaterDate } from '../../utils/helpers';
import RatingStars from '../../components/RatingStars';
import StageCard from '../../components/StageCard';
import Footer from '../../components/Footer';
import './EntreprisePublic.css';

function EntreprisePublic() {
  const { id } = useParams();
  const { t } = useLang();
  const { utilisateur } = useAuth();
  const navigate = useNavigate();

  const [entreprise, setEntreprise] = useState(null);
  const [offres, setOffres] = useState([]);
  const [avis, setAvis] = useState([]);
  const [noteMoyenne, setNoteMoyenne] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [onglet, setOnglet] = useState('offres');

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getProfilEntreprise(id);
        setEntreprise(data.entreprise);
        setOffres(data.offres);
        setAvis(data.avis);
        setNoteMoyenne(data.note_moyenne || 0);
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [id]);

  const handleContact = async () => {
    if (!utilisateur) { navigate('/login'); return; }
    await envoyerMessage(parseInt(id), `Bonjour, je souhaite en savoir plus sur vos opportunités de stage.`);
    navigate(`/etudiant/messages/${id}`);
  };

  if (chargement) {
    return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;
  }
  if (erreur || !entreprise) {
    return <div className="container py-5"><div className="alert alert-danger">{erreur || 'Entreprise introuvable'}</div></div>;
  }

  const profil = entreprise.societe_profile;
  const logoUrl = profil?.logo_path ? getImageUrl(profil.logo_path) : null;
  const nomEntreprise = profil?.company_name || entreprise.name;

  return (
    <div className="entreprise-page">
      {/* ── Banner ── */}
      <div className="ep-banner">
        <div className="container">
          <Link to="/stages" className="btn btn-sm btn-outline-light ep-back-btn">
            <i className="fas fa-arrow-left me-1"></i> Retour
          </Link>
        </div>
      </div>

      {/* ── Header card ── */}
      <div className="container ep-header-container">
        <div className="ep-header card-custom">
          <div className="ep-logo-wrap">
            {logoUrl ? (
              <img src={logoUrl} alt={nomEntreprise} className="ep-logo" />
            ) : (
              <div className="ep-logo ep-logo-placeholder">
                <i className="fas fa-building"></i>
              </div>
            )}
          </div>

          <div className="ep-header-body">
            <div className="ep-header-top">
              <div>
                <h1 className="ep-name">{nomEntreprise}</h1>
                <div className="ep-meta">
                  {profil?.sector && (
                    <span className="ep-meta-item">
                      <i className="fas fa-industry me-1 text-primary"></i>{profil.sector}
                    </span>
                  )}
                  {profil?.city && (
                    <span className="ep-meta-item">
                      <i className="fas fa-map-marker-alt me-1 text-primary"></i>{profil.city}, Maroc
                    </span>
                  )}
                  {offres.length > 0 && (
                    <span className="ep-meta-item">
                      <i className="fas fa-briefcase me-1 text-primary"></i>{offres.length} offre{offres.length > 1 ? 's' : ''} active{offres.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {noteMoyenne > 0 && (
                    <span className="ep-meta-item">
                      <RatingStars note={noteMoyenne} taille="small" />
                      <span className="ms-1" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({avis.length} avis)</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="ep-header-actions">
                {utilisateur?.role === 'etudiant' && (
                  <button className="btn btn-primary" onClick={handleContact}>
                    <i className="fas fa-comment-alt me-2"></i>Contacter
                  </button>
                )}
                {entreprise.is_approved && (
                  <span className="ep-badge-approved">
                    <i className="fas fa-check-circle me-1"></i>Vérifiée
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="ep-tabs">
          {['offres', 'apropos', 'avis'].map((tab) => (
            <button
              key={tab}
              className={`ep-tab ${onglet === tab ? 'active' : ''}`}
              onClick={() => setOnglet(tab)}
            >
              {tab === 'offres' && <><i className="fas fa-briefcase me-2"></i>Offres ({offres.length})</>}
              {tab === 'apropos' && <><i className="fas fa-info-circle me-2"></i>À propos</>}
              {tab === 'avis' && <><i className="fas fa-star me-2"></i>Avis ({avis.length})</>}
            </button>
          ))}
        </div>

        {/* ── Main content ── */}
        <div className="ep-content">

          {/* OFFERS TAB */}
          {onglet === 'offres' && (
            <div>
              {offres.length === 0 ? (
                <div className="ep-empty">
                  <i className="fas fa-briefcase fa-2x mb-3"></i>
                  <p>Aucune offre de stage active pour le moment.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {offres.map((offre) => (
                    <div key={offre.id} className="col-md-6 col-lg-4 d-flex">
                      <StageCard stage={{ ...offre, societe: entreprise }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABOUT TAB */}
          {onglet === 'apropos' && (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card-custom p-4">
                  <h5 className="ep-section-title">
                    <i className="fas fa-building me-2 text-primary"></i>À propos de {nomEntreprise}
                  </h5>
                  {profil?.description ? (
                    <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>{profil.description}</p>
                  ) : (
                    <p className="text-muted">Aucune description disponible.</p>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card-custom p-4">
                  <h5 className="ep-section-title">
                    <i className="fas fa-info me-2 text-primary"></i>Informations
                  </h5>
                  <div className="ep-info-table">
                    <div className="ep-info-row">
                      <span className="ep-info-label">Secteur</span>
                      <span className="ep-info-value">{profil?.sector || '—'}</span>
                    </div>
                    <div className="ep-info-row">
                      <span className="ep-info-label">Ville</span>
                      <span className="ep-info-value">{profil?.city || '—'}</span>
                    </div>
                    <div className="ep-info-row">
                      <span className="ep-info-label">Email</span>
                      <span className="ep-info-value">
                        {entreprise.email ? (
                          <a href={`mailto:${entreprise.email}`} style={{ color: 'var(--primary)' }}>{entreprise.email}</a>
                        ) : '—'}
                      </span>
                    </div>
                    {profil?.website && (
                      <div className="ep-info-row">
                        <span className="ep-info-label">Site web</span>
                        <span className="ep-info-value">
                          <a href={profil.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                            <i className="fas fa-external-link-alt me-1"></i>Visiter
                          </a>
                        </span>
                      </div>
                    )}
                    <div className="ep-info-row">
                      <span className="ep-info-label">Statut</span>
                      <span className="ep-info-value">
                        {entreprise.is_approved ? (
                          <span style={{ color: '#16a34a', fontWeight: 600 }}>
                            <i className="fas fa-check-circle me-1"></i>Vérifiée
                          </span>
                        ) : (
                          <span className="text-muted">En attente</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {onglet === 'avis' && (
            <div>
              {noteMoyenne > 0 && (
                <div className="card-custom p-4 mb-4 d-flex align-items-center gap-4">
                  <div className="text-center">
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{noteMoyenne.toFixed(1)}</div>
                    <RatingStars note={noteMoyenne} />
                    <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>{avis.length} avis</div>
                  </div>
                  <div className="ep-rating-bars">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = avis.filter((a) => a.stars === star).length;
                      const pct = avis.length ? Math.round((count / avis.length) * 100) : 0;
                      return (
                        <div key={star} className="ep-rating-bar-row">
                          <span className="ep-rating-bar-label">{star} ★</span>
                          <div className="ep-rating-bar-track">
                            <div className="ep-rating-bar-fill" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="ep-rating-bar-count">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {avis.length === 0 ? (
                <div className="ep-empty">
                  <i className="fas fa-star fa-2x mb-3"></i>
                  <p>Aucun avis pour le moment.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {avis.map((a) => (
                    <div key={a.id} className="card-custom p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="ep-reviewer-avatar">
                            {(a.etudiant?.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{a.etudiant?.name}</strong>
                            <div><RatingStars note={a.stars} taille="small" /></div>
                          </div>
                        </div>
                        <small className="text-muted">{formaterDate(a.created_at)}</small>
                      </div>
                      {a.comment && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{a.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EntreprisePublic;
