import { useState, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { getStagesAdmin, modifierStageAdmin, supprimerStageAdmin } from '../../api/admin';
import { formaterDate } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';

const villes = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Agadir', 'Tanger', 'Meknès', 'Oujda'];
const secteurs = ['Informatique', 'Finance', 'Marketing', 'Ressources Humaines', 'Comptabilité', 'Commerce', 'Ingénierie', 'Santé', 'Éducation', 'Autre'];
const durees = ['1 mois', '2 mois', '3 mois', '4 mois', '5 mois', '6 mois'];

function AdminStages() {
  const { t } = useLang();

  const [stages, setStages] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { charger(page); }, [page]);

  const charger = async (p) => {
    setChargement(true);
    try {
      const data = await getStagesAdmin(p);
      setStages(data.data);
      setMeta(data);
    } catch (err) {
      setErreur(t('errors.general'));
    } finally {
      setChargement(false);
    }
  };

  const openEdit = (stage) => {
    setEditForm({
      title:           stage.title || '',
      description:     stage.description || '',
      tasks:           stage.tasks || '',
      skills_required: stage.skills_required || '',
      sector:          stage.sector || '',
      city:            stage.city || '',
      duration:        stage.duration || '',
      deadline:        stage.deadline ? stage.deadline.substring(0, 10) : '',
    });
    setEditModal(stage);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await modifierStageAdmin(editModal.id, editForm);
      setStages((prev) => prev.map((s) => s.id === editModal.id ? { ...s, ...updated.stage } : s));
      setEditModal(null);
    } catch (err) {
      setErreur(t('errors.general'));
    } finally {
      setSaving(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await supprimerStageAdmin(id);
      setStages((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setErreur(t('errors.general'));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">{t('admin.stages')}</h1>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
        ) : (
          <div className="card-custom">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>{t('mesOffres.colTitle')}</th>
                    <th>{t('admin.colName')}</th>
                    <th>{t('mesOffres.colCity')}</th>
                    <th>{t('mesOffres.colApplications')}</th>
                    <th>{t('mesOffres.colDeadline')}</th>
                    <th>{t('admin.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stages.map((s) => (
                    <tr key={s.id}>
                      <td>{s.title}</td>
                      <td>{s.societe?.societe_profile?.company_name || s.societe?.name}</td>
                      <td>{s.city}</td>
                      <td><span className="badge bg-primary">{s.candidatures_count}</span></td>
                      <td>{formaterDate(s.deadline || s.created_at)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(s)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleSupprimer(s.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && meta.last_page > 1 && (
              <div className="d-flex justify-content-center gap-2 p-3">
                <button className="btn btn-outline-primary btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  {t('common.previous')}
                </button>
                <span className="d-flex align-items-center px-2 text-muted">{page} / {meta.last_page}</span>
                <button className="btn btn-outline-primary btn-sm" disabled={page === meta.last_page} onClick={() => setPage((p) => p + 1)}>
                  {t('common.next')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {editModal && (
          <div className="modal-overlay" onClick={() => setEditModal(null)}>
            <div className="modal-box card-custom" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
              <h5 className="mb-4" style={{ color: 'var(--text)' }}>
                <i className="fas fa-edit me-2 text-primary"></i>{t('admin.editStage')}
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">{t('offreForm.titleLabel')}</label>
                  <input className="form-control" value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">{t('offreForm.sectorLabel')}</label>
                  <select className="form-select" value={editForm.sector}
                    onChange={(e) => setEditForm((f) => ({ ...f, sector: e.target.value }))}>
                    <option value="">{t('offreForm.chooseOption')}</option>
                    {secteurs.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">{t('offreForm.cityLabel')}</label>
                  <select className="form-select" value={editForm.city}
                    onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}>
                    <option value="">{t('offreForm.chooseOption')}</option>
                    {villes.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">{t('offreForm.durationLabel')}</label>
                  <select className="form-select" value={editForm.duration}
                    onChange={(e) => setEditForm((f) => ({ ...f, duration: e.target.value }))}>
                    <option value="">{t('offreForm.chooseOption')}</option>
                    {durees.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">{t('offreForm.deadlineLabel')}</label>
                  <input type="date" className="form-control" value={editForm.deadline}
                    onChange={(e) => setEditForm((f) => ({ ...f, deadline: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">{t('offreForm.skillsLabel')}</label>
                  <input className="form-control" value={editForm.skills_required}
                    onChange={(e) => setEditForm((f) => ({ ...f, skills_required: e.target.value }))} />
                </div>
                <div className="col-12">
                  <label className="form-label">{t('offreForm.descriptionLabel')}</label>
                  <textarea className="form-control" rows="3" value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="col-12">
                  <label className="form-label">{t('offreForm.tasksLabel')}</label>
                  <textarea className="form-control" rows="2" value={editForm.tasks}
                    onChange={(e) => setEditForm((f) => ({ ...f, tasks: e.target.value }))} />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button className="btn btn-outline-secondary" onClick={() => setEditModal(null)}>
                  {t('common.cancel')}
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving && <span className="spinner-border spinner-border-sm me-2"></span>}
                  {t('common.save')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStages;
