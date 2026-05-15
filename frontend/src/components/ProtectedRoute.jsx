import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { utilisateur, chargement } = useAuth();

  // afficher un loader pendant la vérification de la session
  if (chargement) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  // rediriger vers login si pas connecté
  if (!utilisateur) {
    return <Navigate to="/login" replace />;
  }

  // rediriger vers le bon dashboard si mauvais rôle
  if (role && utilisateur.role !== role) {
    switch (utilisateur.role) {
      case 'etudiant':
        return <Navigate to="/etudiant/dashboard" replace />;
      case 'societe':
        return <Navigate to="/societe/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
