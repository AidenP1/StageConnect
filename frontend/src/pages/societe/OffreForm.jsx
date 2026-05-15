import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { creerOffre, modifierOffre } from '../../api/stages';
import api from '../../api/axiosInstance';
import Sidebar from '../../components/Sidebar';
import './OffreForm.css';

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

function OffreForm() {
  const { id } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();
  const skillInputRef = useRef(null);

  const estModification = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    tasks: '',
    skills_required: '',
    sector: '',
    city: '',
    duration: '',
    deadline: '',
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [chargement, setChargement] = useState(estModification);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (!estModification) return;

    const charger = async () => {
      try {
        const response = await api.get(`/api/stages/${id}`);
        const s = response.data.stage;
        const skillsArr = s.skills_required
          ? s.skills_required.split(',').map((x) => x.trim()).filter(Boolean)
          : [];
        setSkills(skillsArr);
        setForm({
          title: s.title || '',
          description: s.description || '',
          tasks: s.tasks || '',
          skills_required: s.skills_required || '',
          sector: s.sector || '',
          city: s.city || '',
          duration: s.duration || '',
          deadline: s.deadline ? s.deadline.substring(0, 10) : '',
        });
      } catch (err) {
        setErreur(t('errors.general'));
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed || skills.includes(trimmed)) {
      setSkillInput('');
      return;
    }
    const newSkills = [...skills, trimmed];
    setSkills(newSkills);
    setForm((prev) => ({ ...prev, skills_required: newSkills.join(', ') }));
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    setForm((prev) => ({ ...prev, skills_required: newSkills.join(', ') }));
  };

  const filteredSuggestions = COMPETENCES_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      !skills.includes(s)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoi(true);
    setErreur('');

    try {
      if (estModification) {
        await modifierOffre(id, form);
      } else {
        await creerOffre(form);
      }
      navigate('/societe/offres');
    } catch (err) {
      if (err.response?.data?.errors) {
        const premiereErreur = Object.values(err.response.data.errors)[0][0];
        setErreur(premiereErreur);
      } else {
        setErreur(err.response?.data?.message || t('errors.general'));
      }
    } finally {
      setEnvoi(false);
    }
  };

  const secteurs = ['Informatique', 'Finance', 'Marketing', 'Ressources Humaines', 'Comptabilité', 'Commerce', 'Ingénierie', 'Santé', 'Éducation', 'Autre'];
  const villes = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Agadir', 'Tanger', 'Meknès', 'Oujda'];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">
          {estModification ? t('offreForm.editTitle') : t('nav.newOffer')}
        </h1>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="card-custom p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-12">
                  <label className="form-label">{t('offreForm.titleLabel')} *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{t('offreForm.sectorLabel')} *</label>
                  <select className="form-select" name="sector" value={form.sector} onChange={handleChange} required>
                    <option value="">{t('offreForm.chooseOption')}</option>
                    {secteurs.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">{t('offreForm.cityLabel')} *</label>
                  <select className="form-select" name="city" value={form.city} onChange={handleChange} required>
                    <option value="">{t('offreForm.chooseOption')}</option>
                    {villes.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">{t('offreForm.durationLabel')}</label>
                  <select className="form-select" name="duration" value={form.duration} onChange={handleChange}>
                    <option value="">{t('offreForm.chooseOption')}</option>
                    {['1 mois', '2 mois', '3 mois', '4 mois', '5 mois', '6 mois'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">{t('offreForm.deadlineLabel')}</label>
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">{t('offreForm.descriptionLabel')} *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">{t('offreForm.tasksLabel')}</label>
                  <textarea
                    className="form-control"
                    name="tasks"
                    rows="3"
                    value={form.tasks}
                    onChange={handleChange}
                  />
                </div>

                {/* Skills tag input */}
                <div className="col-12">
                  <label className="form-label">{t('offreForm.skillsLabel')}</label>

                  {skills.length > 0 && (
                    <div className="skills-tags mb-2">
                      {skills.map((skill) => (
                        <span key={skill} className="skill-tag">
                          {skill}
                          <button
                            type="button"
                            className="skill-tag-remove"
                            onClick={() => removeSkill(skill)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="skill-input-wrapper">
                    <input
                      ref={skillInputRef}
                      type="text"
                      className="form-control"
                      placeholder={t('offreForm.skillsSearch')}
                      value={skillInput}
                      onChange={(e) => {
                        setSkillInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (skillInput.trim()) addSkill(skillInput);
                        }
                      }}
                    />

                    {showSuggestions && skillInput && filteredSuggestions.length > 0 && (
                      <div className="skill-suggestions">
                        {filteredSuggestions.slice(0, 7).map((s) => (
                          <div
                            key={s}
                            className="skill-suggestion-item"
                            onMouseDown={() => addSkill(s)}
                          >
                            <i className="fas fa-plus-circle me-2 text-primary" style={{ fontSize: '0.75rem' }}></i>
                            {s}
                          </div>
                        ))}
                        {!filteredSuggestions.some(
                          (s) => s.toLowerCase() === skillInput.toLowerCase()
                        ) && (
                          <div
                            className="skill-suggestion-item skill-suggestion-custom"
                            onMouseDown={() => addSkill(skillInput)}
                          >
                            <i className="fas fa-tag me-2 text-success" style={{ fontSize: '0.75rem' }}></i>
                            {t('offreForm.addTag')} « {skillInput} »
                          </div>
                        )}
                      </div>
                    )}

                    {showSuggestions && skillInput && filteredSuggestions.length === 0 && (
                      <div className="skill-suggestions">
                        <div
                          className="skill-suggestion-item skill-suggestion-custom"
                          onMouseDown={() => addSkill(skillInput)}
                        >
                          <i className="fas fa-tag me-2 text-success" style={{ fontSize: '0.75rem' }}></i>
                          {t('offreForm.addTag')} « {skillInput} »
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={envoi}>
                    {envoi && <span className="spinner-border spinner-border-sm me-2"></span>}
                    {estModification ? t('common.save') : t('offreForm.publishBtn')}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/societe/offres')}>
                    {t('common.cancel')}
                  </button>
                </div>

              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default OffreForm;
