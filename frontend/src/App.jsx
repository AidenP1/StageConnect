import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// pages publiques
import Landing from './pages/public/Landing';
import StagesPublic from './pages/public/StagesPublic';
import StageDetail from './pages/public/StageDetail';
import EntreprisePublic from './pages/public/EntreprisePublic';
import NotFound from './pages/public/NotFound';

// pages auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// pages étudiant
import EtudiantDashboard from './pages/etudiant/Dashboard';
import EtudiantStages from './pages/etudiant/Stages';
import MesCandidatures from './pages/etudiant/MesCandidatures';
import Favoris from './pages/etudiant/Favoris';
import EtudiantMessages from './pages/etudiant/Messages';
import EtudiantProfile from './pages/etudiant/Profile';

// pages société
import SocieteDashboard from './pages/societe/Dashboard';
import SocieteProfile from './pages/societe/Profile';
import MesOffres from './pages/societe/MesOffres';
import OffreForm from './pages/societe/OffreForm';
import CandidaturesSociete from './pages/societe/Candidatures';
import SocieteStats from './pages/societe/Stats';
import SocieteMessages from './pages/societe/Messages';

// pages admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminStages from './pages/admin/Stages';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LangProvider>
          <AuthProvider>
            <Navbar />
            <Routes>
              {/* routes publiques */}
              <Route path="/" element={<Landing />} />
              <Route path="/stages" element={<StagesPublic />} />
              <Route path="/stages/:id" element={<StageDetail />} />
              <Route path="/entreprises/:id" element={<EntreprisePublic />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* routes étudiant */}
              <Route path="/etudiant/dashboard" element={
                <ProtectedRoute role="etudiant"><EtudiantDashboard /></ProtectedRoute>
              } />
              <Route path="/etudiant/stages" element={
                <ProtectedRoute role="etudiant"><EtudiantStages /></ProtectedRoute>
              } />
              <Route path="/etudiant/candidatures" element={
                <ProtectedRoute role="etudiant"><MesCandidatures /></ProtectedRoute>
              } />
              <Route path="/etudiant/favoris" element={
                <ProtectedRoute role="etudiant"><Favoris /></ProtectedRoute>
              } />
              <Route path="/etudiant/messages" element={
                <ProtectedRoute role="etudiant"><EtudiantMessages /></ProtectedRoute>
              } />
              <Route path="/etudiant/messages/:interlocuteurId" element={
                <ProtectedRoute role="etudiant"><EtudiantMessages /></ProtectedRoute>
              } />
              <Route path="/etudiant/profile" element={
                <ProtectedRoute role="etudiant"><EtudiantProfile /></ProtectedRoute>
              } />

              {/* routes société */}
              <Route path="/societe/dashboard" element={
                <ProtectedRoute role="societe"><SocieteDashboard /></ProtectedRoute>
              } />
              <Route path="/societe/profile" element={
                <ProtectedRoute role="societe"><SocieteProfile /></ProtectedRoute>
              } />
              <Route path="/societe/offres" element={
                <ProtectedRoute role="societe"><MesOffres /></ProtectedRoute>
              } />
              <Route path="/societe/offres/nouvelle" element={
                <ProtectedRoute role="societe"><OffreForm /></ProtectedRoute>
              } />
              <Route path="/societe/offres/:id/modifier" element={
                <ProtectedRoute role="societe"><OffreForm /></ProtectedRoute>
              } />
              <Route path="/societe/offres/:id/candidatures" element={
                <ProtectedRoute role="societe"><CandidaturesSociete /></ProtectedRoute>
              } />
              <Route path="/societe/stats" element={
                <ProtectedRoute role="societe"><SocieteStats /></ProtectedRoute>
              } />
              <Route path="/societe/messages" element={
                <ProtectedRoute role="societe"><SocieteMessages /></ProtectedRoute>
              } />
              <Route path="/societe/messages/:interlocuteurId" element={
                <ProtectedRoute role="societe"><SocieteMessages /></ProtectedRoute>
              } />

              {/* routes admin */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/utilisateurs" element={
                <ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>
              } />
              <Route path="/admin/stages" element={
                <ProtectedRoute role="admin"><AdminStages /></ProtectedRoute>
              } />

              {/* page 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
