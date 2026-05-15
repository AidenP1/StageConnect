import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { register } from '../../api/auth';
import './Register.css';

function Register() {
  const { t } = useLang();
  const { connecter } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('etudiant');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    if (password !== passwordConfirm) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }

    setChargement(true);

    try {
      const data = await register(nom, email, password, passwordConfirm, role);
      connecter(data.utilisateur);

      if (role === 'etudiant') {
        navigate('/etudiant/dashboard');
      } else {
        navigate('/societe/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const premierreErreur = Object.values(err.response.data.errors)[0][0];
        setErreur(premierreErreur);
      } else {
        setErreur(err.response?.data?.message || t('errors.general'));
      }
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box card-custom">
        <div className="auth-logo">
          <i className="fas fa-briefcase me-2 text-primary"></i>
          <span className="fw-bold">StageConnect</span>
        </div>

        <h2 className="auth-title">{t('auth.registerTitle')}</h2>

        {erreur && (
          <div className="alert alert-danger py-2">{erreur}</div>
        )}

        {/* choix du rôle en style carte */}
        <div className="role-choice mb-4">
          <div
            className={`role-card ${role === 'etudiant' ? 'active' : ''}`}
            onClick={() => setRole('etudiant')}
          >
            <i className="fas fa-graduation-cap fa-2x mb-2"></i>
            <span>{t('auth.student')}</span>
          </div>
          <div
            className={`role-card ${role === 'societe' ? 'active' : ''}`}
            onClick={() => setRole('societe')}
          >
            <i className="fas fa-building fa-2x mb-2"></i>
            <span>{t('auth.company')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{t('auth.name')}</label>
            <input
              type="text"
              className="form-control"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{t('auth.email')}</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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

          <div className="mb-3">
            <label className="form-label">{t('auth.confirmPassword')}</label>
            <input
              type="password"
              className="form-control"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            disabled={chargement}
          >
            {chargement ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            {t('auth.registerBtn')}
          </button>
        </form>

        <p className="auth-link mt-3">
          {t('auth.haveAccount')}{' '}
          <Link to="/login">{t('auth.loginHere')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
