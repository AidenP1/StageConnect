import { Link } from 'react-router-dom';
import { useLang } from '../../context/LangContext';

function NotFound() {
  const { t } = useLang();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', textAlign: 'center', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 700, color: 'var(--primary)' }}>404</h1>
      <h2 style={{ color: 'var(--text)' }}>{t('errors.notFound')}</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 24 }}>{t('errors.notFoundMsg')}</p>
      <Link to="/" className="btn btn-primary">
        <i className="fas fa-home me-2"></i>
        {t('errors.backHome')}
      </Link>
    </div>
  );
}

export default NotFound;
