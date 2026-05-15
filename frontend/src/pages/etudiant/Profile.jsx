import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import api from '../../api/axiosInstance';
import { getImageUrl } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';
import './Profile.css';
import '../societe/OffreForm.css';

const COMPETENCES_SUGGESTIONS = [
  'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript',
  'Node.js', 'Express', 'PHP', 'Laravel', 'Python',
  'Django', 'Flask', 'Java', 'Spring Boot', 'C#', '.NET',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS', 'Git',
  'Docker', 'Linux', 'AWS', 'Azure', 'REST API',
  'GraphQL', 'WordPress', 'Figma', 'UX/UI Design',
  'Adobe Photoshop', 'Excel', 'Power BI', 'Marketing Digital',
  'SEO', 'Google Analytics', 'Comptabilité', 'Finance',
  'Gestion de projet', 'Agile', 'Scrum', 'Networking',
];

function EtudiantProfile() {
  const { utilisateur } = useAuth();
  const { t } = useLang();
  const photoInputRef = useRef(null);
  const skillInputRef = useRef(null);

  const [profil, setProfil] = useState({ filiere: '', skills: '', bio: '', city: '', portfolio_url: '' });
  const [nom, setNom]     = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [cvPath, setCvPath]     = useState(null);
  const [chargement, setChargement] = useState(true);
  const [modeEdit, setModeEdit]     = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [erreur, setErreur]   = useState('');
  const [success, setSuccess] = useState('');

  // données brutes pour annuler les changements
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const response = await api.get('/api/etudiant/profile');
        const p = response.data.profil || {};
        const u = response.data.utilisateur || {};
        const data = {
          filiere:       p.filiere       || '',
          skills:        p.skills        || '',
          bio:           p.bio           || '',
          city:          p.city          || '',
          portfolio_url: p.portfolio_url || '',
        };
        setProfil(data);
        setNom(u.name || '');
        setCvPath(p.cv_path || null);
        if (p.photo_path) setPhotoUrl(getImageUrl(p.photo_path));
        setSnapshot({ nom: u.name || '', profil: data });
      } catch {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const annuler = () => {
    if (snapshot) {
      setNom(snapshot.nom);
      setProfil(snapshot.profil);
    }
    setModeEdit(false);
    setErreur('');
    setSuccess('');
  };

  const handleSauvegarder = async (e) => {
    e.preventDefault();
    setSauvegarde(true);
    setErreur('');
    setSuccess('');
    try {
      await api.put('/api/etudiant/profile', { name: nom, ...profil });
      setSnapshot({ nom, profil: { ...profil } });
      setSuccess('Profil mis à jour avec succès !');
      setModeEdit(false);
    } catch {
      setErreur(t('errors.general'));
    } finally {
      setSauvegarde(false);
    }
  };

  const handleUploadPhoto = async (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    const formData = new FormData();
    formData.append('photo', fichier);
    try {
      const response = await api.post('/api/etudiant/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhotoUrl(getImageUrl(response.data.photo_path));
    } catch {
      setErreur(t('errors.general'));
    }
  };

  const handleUploadCV = async (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    const formData = new FormData();
    formData.append('cv', fichier);
    try {
      const response = await api.post('/api/etudiant/profile/cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCvPath(response.data.cv_path);
      setSuccess('CV téléversé avec succès !');
    } catch {
      setErreur(t('errors.general'));
    }
  };

  const skillsList = profil.skills
    ? profil.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed || skillsList.includes(trimmed)) { setSkillInput(''); return; }
    const newSkills = [...skillsList, trimmed];
    setProfil((p) => ({ ...p, skills: newSkills.join(', ') }));
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    const newSkills = skillsList.filter((s) => s !== skill);
    setProfil((p) => ({ ...p, skills: newSkills.join(', ') }));
  };

  const filteredSuggestions = COMPETENCES_SUGGESTIONS.filter(
    (s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !skillsList.includes(s)
  );

  const villes = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Agadir', 'Tanger', 'Meknès', 'Oujda'];

  // calcul avancement profil
  const champs = [nom, profil.filiere, profil.city, profil.skills, profil.bio, profil.portfolio_url, cvPath, photoUrl];
  const completion = Math.round((champs.filter(Boolean).length / champs.length) * 100);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">

        {erreur  && <div className="alert alert-danger mb-3">{erreur}</div>}
        {success && <div className="alert alert-success mb-3">{success}</div>}

        {chargement ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="profile-layout">

            {/* ── carte profil principale (style LinkedIn) ── */}
            <div className="profile-main-card card-custom">
              {/* bannière */}
              <div className="profile-banner">
                <div className="profile-banner-gradient" />
              </div>

              {/* avatar + actions */}
              <div className="profile-header-row">
                <div className="profile-avatar-wrapper">
                  <div
                    className="profile-avatar"
                    onClick={() => photoInputRef.current?.click()}
                    title="Changer la photo"
                  >
                    {photoUrl ? (
                      <img src={photoUrl} alt="Photo de profil" />
                    ) : (
                      <span className="profile-avatar-initials">
                        {nom ? nom.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                    <div className="profile-avatar-overlay">
                      <i className="fas fa-camera"></i>
                    </div>
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleUploadPhoto}
                  />
                </div>

                <div className="profile-header-actions">
                  {!modeEdit ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setModeEdit(true)}
                    >
                      <i className="fas fa-pen me-2"></i>Modifier le profil
                    </button>
                  ) : (
                    <button className="btn btn-outline-secondary btn-sm" onClick={annuler}>
                      Annuler
                    </button>
                  )}
                </div>
              </div>

              {/* infos en lecture */}
              {!modeEdit ? (
                <div className="profile-info-view">
                  <h2 className="profile-name">{nom || 'Nom non défini'}</h2>
                  {profil.filiere && (
                    <p className="profile-headline">{profil.filiere}</p>
                  )}
                  <div className="profile-meta">
                    {profil.city && (
                      <span><i className="fas fa-map-marker-alt me-1"></i>{profil.city}, Maroc</span>
                    )}
                    {utilisateur?.email && (
                      <span><i className="fas fa-envelope me-1"></i>{utilisateur.email}</span>
                    )}
                    {profil.portfolio_url && (
                      <a href={profil.portfolio_url} target="_blank" rel="noreferrer" className="profile-meta-link">
                        <i className="fas fa-globe me-1"></i>Portfolio
                      </a>
                    )}
                  </div>

                  {/* barre de complétion */}
                  <div className="profile-completion mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Complétion du profil</small>
                      <small className="fw-bold" style={{ color: completion >= 80 ? 'var(--success)' : 'var(--primary)' }}>
                        {completion}%
                      </small>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${completion}%`,
                          backgroundColor: completion >= 80 ? 'var(--success)' : 'var(--primary)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* formulaire d'édition inline */
                <form className="profile-edit-form" onSubmit={handleSauvegarder}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nom complet</label>
                      <input
                        className="form-control"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Filière</label>
                      <input
                        className="form-control"
                        placeholder="ex: Développement Web Full-Stack"
                        value={profil.filiere}
                        onChange={(e) => setProfil((p) => ({ ...p, filiere: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ville</label>
                      <select
                        className="form-select"
                        value={profil.city}
                        onChange={(e) => setProfil((p) => ({ ...p, city: e.target.value }))}
                      >
                        <option value="">-- Choisir --</option>
                        {villes.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Compétences</label>
                      {skillsList.length > 0 && (
                        <div className="skills-tags mb-2">
                          {skillsList.map((skill) => (
                            <span key={skill} className="skill-tag">
                              {skill}
                              <button type="button" className="skill-tag-remove" onClick={() => removeSkill(skill)}>×</button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="skill-input-wrapper">
                        <input
                          ref={skillInputRef}
                          type="text"
                          className="form-control"
                          placeholder="Rechercher une compétence..."
                          value={skillInput}
                          onChange={(e) => { setSkillInput(e.target.value); setShowSuggestions(true); }}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (skillInput.trim()) addSkill(skillInput); } }}
                        />
                        {showSuggestions && skillInput && filteredSuggestions.length > 0 && (
                          <div className="skill-suggestions">
                            {filteredSuggestions.slice(0, 7).map((s) => (
                              <div key={s} className="skill-suggestion-item" onMouseDown={() => addSkill(s)}>
                                <i className="fas fa-plus-circle me-2 text-primary" style={{ fontSize: '0.75rem' }}></i>{s}
                              </div>
                            ))}
                            {skillInput && !COMPETENCES_SUGGESTIONS.includes(skillInput) && (
                              <div className="skill-suggestion-item skill-suggestion-custom" onMouseDown={() => addSkill(skillInput)}>
                                <i className="fas fa-plus me-2" style={{ fontSize: '0.75rem' }}></i>Ajouter "{skillInput}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label">À propos</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Décrivez votre parcours, vos objectifs..."
                        value={profil.bio}
                        onChange={(e) => setProfil((p) => ({ ...p, bio: e.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Portfolio / Site web</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://mon-portfolio.com"
                        value={profil.portfolio_url}
                        onChange={(e) => setProfil((p) => ({ ...p, portfolio_url: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={sauvegarde}>
                      {sauvegarde && <span className="spinner-border spinner-border-sm me-2"></span>}
                      Enregistrer
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={annuler}>
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ── colonne droite ── */}
            <div className="profile-side">

              {/* À propos */}
              {profil.bio && !modeEdit && (
                <div className="card-custom p-4 profile-section-card">
                  <h6 className="profile-section-title">
                    <i className="fas fa-user me-2 text-primary"></i>À propos
                  </h6>
                  <p className="profile-bio-text">{profil.bio}</p>
                </div>
              )}

              {/* Compétences */}
              {skillsList.length > 0 && !modeEdit && (
                <div className="card-custom p-4 profile-section-card">
                  <h6 className="profile-section-title">
                    <i className="fas fa-code me-2 text-primary"></i>Compétences
                  </h6>
                  <div className="skills-list">
                    {skillsList.map((skill) => (
                      <span key={skill} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* CV */}
              <div className="card-custom p-4 profile-section-card">
                <h6 className="profile-section-title">
                  <i className="fas fa-file-pdf me-2 text-primary"></i>Curriculum Vitae
                </h6>
                {cvPath ? (
                  <div className="cv-section">
                    <div className="cv-preview-row">
                      <i className="fas fa-file-pdf fa-2x text-danger"></i>
                      <div>
                        <p className="cv-filename mb-0">{cvPath.split('/').pop()}</p>
                        <small className="text-muted">PDF uploadé</small>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-2">
                      <a
                        href={getImageUrl(cvPath)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary btn-sm flex-fill"
                      >
                        <i className="fas fa-eye me-1"></i>Voir
                      </a>
                      <a
                        href={getImageUrl(cvPath)}
                        download
                        className="btn btn-outline-secondary btn-sm flex-fill"
                      >
                        <i className="fas fa-download me-1"></i>Télécharger
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted small">Aucun CV téléversé.</p>
                )}
                <label className="btn btn-sm btn-outline-primary w-100 mt-3" style={{ cursor: 'pointer' }}>
                  <i className="fas fa-upload me-2"></i>
                  {cvPath ? 'Remplacer le CV' : 'Uploader mon CV (PDF)'}
                  <input
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={handleUploadCV}
                  />
                </label>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EtudiantProfile;
