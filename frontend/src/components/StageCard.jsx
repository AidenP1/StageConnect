import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { formaterDate, tronquer, getImageUrl, estExpire } from '../utils/helpers';
import './StageCard.css';

function StageCard({ stage, onPostuler, onToggleFavori, estFavori, dejaPostule }) {
  const { utilisateur } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const handlePostuler = () => {
    if (!utilisateur) {
      navigate('/login');
      return;
    }
    if (onPostuler) {
      onPostuler(stage);
    } else {
      // no modal on this page — go to stage detail to apply
      navigate(`/stages/${stage.id}`);
    }
  };

  const handleFavori = () => {
    if (!utilisateur) {
      navigate('/login');
      return;
    }
    if (onToggleFavori) onToggleFavori(stage.id);
  };

  const expire = estExpire(stage.deadline);
  const logoUrl = stage.societe?.societe_profile?.logo_path
    ? getImageUrl(stage.societe.societe_profile.logo_path)
    : null;

  const nomEntreprise = stage.societe?.societe_profile?.company_name || stage.societe?.name || 'Entreprise';

  return (
    <div className="stage-card card-custom h-100">
      <div className="stage-card-body">
        <div className="stage-card-header">
          <div className="stage-logo">
            {logoUrl ? (
              <img src={logoUrl} alt={nomEntreprise} className="company-logo" />
            ) : (
              <div className="logo-placeholder">
                <i className="fas fa-building"></i>
              </div>
            )}
          </div>
          <div className="stage-company-info">
            <Link to={`/entreprises/${stage.societe_id}`} className="stage-company">{nomEntreprise}</Link>
            {stage.city && (
              <span className="stage-city">
                <i className="fas fa-map-marker-alt me-1"></i>
                {stage.city}
              </span>
            )}
          </div>
          {onToggleFavori && (
            <button className="btn-favori" onClick={handleFavori} title={t('stages.save')}>
              <i className={`fa${estFavori ? 's' : 'r'} fa-heart`}></i>
            </button>
          )}
        </div>

        <h3 className="stage-title">
          <Link to={`/stages/${stage.id}`}>{stage.title}</Link>
        </h3>

        <p className="stage-description">{tronquer(stage.description, 120)}</p>

        <div className="stage-badges">
          {stage.sector && (
            <span className="badge badge-sector">{stage.sector}</span>
          )}
          {stage.duration && (
            <span className="badge badge-duration">
              <i className="fas fa-clock me-1"></i>
              {stage.duration}
            </span>
          )}
        </div>

        <div className="stage-footer">
          {stage.deadline && (
            <span className={`stage-deadline ${expire ? 'expire' : ''}`}>
              <i className="fas fa-calendar me-1"></i>
              {t('stages.deadline')}: {formaterDate(stage.deadline)}
              {expire && ' (Expiré)'}
            </span>
          )}

          <div className="stage-actions">
            {stage.views_count !== undefined && (
              <span className="views-count">
                <i className="fas fa-eye me-1"></i>
                {stage.views_count}
              </span>
            )}

            {utilisateur?.role === 'societe' || utilisateur?.role === 'admin' ? null : utilisateur ? (
              dejaPostule ? (
                <span className="btn btn-sm btn-outline-success disabled">
                  <i className="fas fa-check me-1"></i>{t('stages.alreadyApplied')}
                </span>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handlePostuler}
                  disabled={expire}
                >
                  {t('stages.apply')}
                </button>
              )
            ) : (
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handlePostuler}
                title={t('stages.loginToApply')}
              >
                <i className="fas fa-lock me-1"></i>
                {t('stages.apply')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StageCard;
