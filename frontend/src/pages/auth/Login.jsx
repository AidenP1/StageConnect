import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/auth';
import './Login.css';

const DEMO_COMPTES = [
  { label: 'Admin',    icon: 'fa-shield-alt',     color: '#dc3545', email: 'admin@stageconnect.ma', password: 'password123' },
  { label: 'Étudiant', icon: 'fa-graduation-cap', color: '#2563eb', email: 'etudiant@demo.ma',      password: 'password123' },
  { label: 'Société',  icon: 'fa-building',       color: '#198754', email: 'contact@techmaroc.ma',  password: 'password123' },
];

function Login() {
  const { t } = useLang();
  const { connecter } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [demoActif, setDemoActif] = useState(null);

  const soumettre = async (emailVal, passwordVal) => {
    setErreur('');
    setChargement(true);
    try {
      const data = await login(emailVal, passwordVal);
      connecter(data.utilisateur);
      switch (data.utilisateur.role) {
        case 'etudiant': navigate('/etudiant/dashboard'); break;
        case 'societe':  navigate('/societe/dashboard');  break;
        case 'admin':    navigate('/admin/dashboard');    break;
        default:         navigate('/');
      }
    } catch (err) {
      setErreur(err.response?.data?.message || t('errors.general'));
    } finally {
      setChargement(false);
      setDemoActif(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soumettre(email, password);
  };

  const connexionRapide = (compte) => {
    setDemoActif(compte.label);
    setEmail(compte.email);
    setPassword(compte.password);
    soumettre(compte.email, compte.password);
  };

  return (
    <div className="auth-page">
      <div className="auth-box card-custom">
        <div className="auth-logo">
          <i className="fas fa-briefcase me-2 text-primary"></i>
          <span className="fw-bold">StageConnect</span>
        </div>

        <h2 className="auth-title">{t('auth.loginTitle')}</h2>

        {/* connexion rapide démo */}
        <div className="demo-section">
          <p className="demo-label">Connexion rapide (démo)</p>
          <div className="demo-cards">
            {DEMO_COMPTES.map((c) => (
              <button
                key={c.label}
                className="demo-card"
                style={{ borderColor: c.color }}
                onClick={() => connexionRapide(c)}
                disabled={chargement}
              >
                {demoActif === c.label ? (
                  <span className="spinner-border spinner-border-sm" style={{ color: c.color }}></span>
                ) : (
                  <i className={`fas ${c.icon}`} style={{ color: c.color }}></i>
                )}
                <span style={{ color: c.color, fontWeight: 600 }}>{c.label}</span>
                <small style={{ color: c.color, opacity: 0.75, fontSize: '0.65rem', lineHeight: 1.2 }}>{c.email}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="demo-divider"><span>ou entrez vos identifiants</span></div>

        {erreur && (
          <div className="alert alert-danger py-2">{erreur}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{t('auth.email')}</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{t('auth.password')}</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            disabled={chargement}
          >
            {chargement && !demoActif ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <i className="fas fa-sign-in-alt me-2"></i>
            )}
            {t('auth.loginBtn')}
          </button>
        </form>

        <p className="auth-link mt-3">
          {t('auth.noAccount')}{' '}
          <Link to="/register">{t('auth.registerHere')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
