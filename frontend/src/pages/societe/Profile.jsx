import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { getMonProfilSociete, mettreAJourProfilSociete, uploaderLogo } from '../../api/societe';
import { getImageUrl } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';
import './Profile.css';

const SECTEURS = ['Informatique','Finance','Marketing','Ressources Humaines','Comptabilité','Commerce','Ingénierie','Santé','Éducation','Autre'];
const VILLES   = ['Casablanca','Rabat','Marrakech','Fès','Agadir','Tanger','Meknès','Oujda'];

function SocieteProfile() {
  const { utilisateur } = useAuth();
  const { t } = useLang();
  const logoInputRef = useRef(null);

  const [form, setForm]         = useState({ company_name: '', sector: '', city: '', description: '' });
  const [nom, setNom]           = useState('');
  const [logoUrl, setLogoUrl]   = useState(null);
  const [chargement, setChargement] = useState(true);
  const [modeEdit, setModeEdit]     = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [erreur, setErreur]   = useState('');
  const [success, setSuccess] = useState('');
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getMonProfilSociete();
        const p = data.profil || {};
        const u = data.utilisateur || {};
        const formData = {
          company_name: p.company_name || '',
          sector:       p.sector       || '',
          city:         p.city         || '',
          description:  p.description  || '',
        };
        setForm(formData);
        setNom(u.name || '');
        if (p.logo_path) setLogoUrl(getImageUrl(p.logo_path));
        setSnapshot({ nom: u.name || '', form: formData });
      } catch {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const annuler = () => {
    if (snapshot) { setNom(snapshot.nom); setForm(snapshot.form); }
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
      await mettreAJourProfilSociete({ name: nom, ...form });
      setSnapshot({ nom, form: { ...form } });
      setSuccess('Profil mis à jour avec succès !');
      setModeEdit(false);
    } catch {
      setErreur(t('errors.general'));
    } finally {
      setSauvegarde(false);
    }
  };

  const handleUploadLogo = async (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    const formData = new FormData();
    formData.append('logo', fichier);
    try {
      const data = await uploaderLogo(formData);
      setLogoUrl(getImageUrl(data.logo_path));
    } catch {
      setErreur(t('errors.general'));
    }
  };

  // complétion
  const champs = [nom, form.company_name, form.sector, form.city, form.description, logoUrl];
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

            {/* ── carte profil principale ── */}
            <div className="profile-main-card card-custom">
              <div className="profile-banner">
                <div
                  className="profile-banner-gradient"
                  style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)' }}
                />
              </div>

              <div className="profile-header-row">
                <div className="profile-avatar-wrapper">
                  <div
                    className="profile-avatar profile-avatar-square"
                    onClick={() => logoInputRef.current?.click()}
                    title="Changer le logo"
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo entreprise" style={{ objectFit: 'contain', padding: 8 }} />
                    ) : (
                      <span className="profile-avatar-initials">
                        {form.company_name ? form.company_name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                    <div className="profile-avatar-overlay">
                      <i className="fas fa-camera"></i>
                    </div>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleUploadLogo}
                  />
                </div>

                <div className="profile-header-actions">
                  {!modeEdit ? (
                    <button className="btn btn-primary btn-sm" onClick={() => setModeEdit(true)}>
                      <i className="fas fa-pen me-2"></i>Modifier le profil
                    </button>
                  ) : (
                    <button className="btn btn-outline-secondary btn-sm" onClick={annuler}>
                      Annuler
                    </button>
                  )}
                </div>
              </div>

              {/* vue lecture */}
              {!modeEdit ? (
                <div className="profile-info-view">
                  <h2 className="profile-name">{form.company_name || nom || 'Entreprise'}</h2>
                  {form.sector && <p className="profile-headline">{form.sector}</p>}
                  <div className="profile-meta">
                    {form.city && (
                      <span><i className="fas fa-map-marker-alt me-1"></i>{form.city}, Maroc</span>
                    )}
                    {utilisateur?.email && (
                      <span><i className="fas fa-envelope me-1"></i>{utilisateur.email}</span>
                    )}
                    <span><i className="fas fa-user-tie me-1"></i>Contact : {nom}</span>
                  </div>

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
                /* formulaire édition */
                <form className="profile-edit-form" onSubmit={handleSauvegarder}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nom du contact</label>
                      <input
                        className="form-control"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nom de l'entreprise</label>
                      <input
                        className="form-control"
                        value={form.company_name}
                        onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Secteur d'activité</label>
                      <select
                        className="form-select"
                        value={form.sector}
                        onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))}
                      >
                        <option value="">-- Choisir --</option>
                        {SECTEURS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ville</label>
                      <select
                        className="form-select"
                        value={form.city}
                        onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      >
                        <option value="">-- Choisir --</option>
                        {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description de l'entreprise</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Décrivez votre entreprise, vos activités, votre culture..."
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
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

              {/* Description */}
              {form.description && !modeEdit && (
                <div className="card-custom p-4 profile-section-card">
                  <h6 className="profile-section-title">
                    <i className="fas fa-building me-2 text-primary"></i>À propos de l'entreprise
                  </h6>
                  <p className="profile-bio-text">{form.description}</p>
                </div>
              )}

              {/* Infos rapides */}
              {!modeEdit && (
                <div className="card-custom p-4 profile-section-card">
                  <h6 className="profile-section-title">
                    <i className="fas fa-info-circle me-2 text-primary"></i>Informations
                  </h6>
                  <ul className="profile-info-list">
                    {form.sector && (
                      <li>
                        <i className="fas fa-industry me-2 text-muted"></i>
                        <span>{form.sector}</span>
                      </li>
                    )}
                    {form.city && (
                      <li>
                        <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                        <span>{form.city}, Maroc</span>
                      </li>
                    )}
                    {utilisateur?.email && (
                      <li>
                        <i className="fas fa-envelope me-2 text-muted"></i>
                        <span>{utilisateur.email}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SocieteProfile;
