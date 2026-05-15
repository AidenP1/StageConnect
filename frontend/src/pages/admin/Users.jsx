import { useState, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import {
  getUtilisateursAdmin,
  supprimerUtilisateurAdmin,
  approuverUtilisateurAdmin,
  modifierUtilisateurAdmin,
} from '../../api/admin';
import { formaterDate } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';

function AdminUsers() {
  const { t } = useLang();

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    charger(page);
  }, [page]);

  const charger = async (p) => {
    setChargement(true);
    try {
      const data = await getUtilisateursAdmin(p);
      setUtilisateurs(data.data);
      setMeta(data);
    } catch (err) {
      setErreur(t('errors.general'));
    } finally {
      setChargement(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await supprimerUtilisateurAdmin(id);
      setUtilisateurs((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setErreur(err.response?.data?.message || t('errors.general'));
    }
  };

  const handleApprouver = async (id, valeur) => {
    try {
      await approuverUtilisateurAdmin(id, valeur);
      setUtilisateurs((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_approved: valeur } : u))
      );
    } catch (err) {
      setErreur(t('errors.general'));
    }
  };

  const ouvrirEdit = (u) => {
    setEditModal(u);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  };

  const handleEdit = async () => {
    try {
      await modifierUtilisateurAdmin(editModal.id, editForm);
      setUtilisateurs((prev) =>
        prev.map((u) => (u.id === editModal.id ? { ...u, ...editForm } : u))
      );
      setEditModal(null);
    } catch (err) {
      setErreur(t('errors.general'));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">{t('admin.users')}</h1>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="card-custom">
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th>{t('admin.colName')}</th>
                    <th>{t('admin.colEmail')}</th>
                    <th>{t('admin.colRole')}</th>
                    <th>{t('admin.colStatus')}</th>
                    <th>{t('admin.colRegistration')}</th>
                    <th>{t('admin.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {utilisateurs.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge bg-${u.role === 'admin' ? 'danger' : u.role === 'societe' ? 'info' : 'success'}`}>
                          {u.role === 'etudiant' ? t('auth.student') : u.role === 'societe' ? t('auth.company') : 'Admin'}
                        </span>
                      </td>
                      <td>
                        {u.is_approved ? (
                          <span className="badge bg-success">{t('admin.approved')}</span>
                        ) : (
                          <span className="badge bg-warning text-dark">{t('admin.pending')}</span>
                        )}
                      </td>
                      <td>{formaterDate(u.created_at)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => ouvrirEdit(u)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          {u.role === 'societe' && (
                            <button
                              className={`btn btn-sm ${u.is_approved ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              onClick={() => handleApprouver(u.id, !u.is_approved)}
                            >
                              <i className={`fas fa-${u.is_approved ? 'ban' : 'check'}`}></i>
                            </button>
                          )}
                          {u.role !== 'admin' && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleSupprimer(u.id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
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

        {/* modal modification */}
        {editModal && (
          <div className="modal-overlay" onClick={() => setEditModal(null)}>
            <div className="modal-box card-custom" onClick={(e) => e.stopPropagation()}>
              <h5 className="mb-3">{t('admin.editUser')}</h5>
              <div className="mb-3">
                <label className="form-label">{t('admin.colName')}</label>
                <input className="form-control" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="form-label">{t('admin.colEmail')}</label>
                <input className="form-control" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="form-label">{t('admin.colRole')}</label>
                <select className="form-select" value={editForm.role} onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}>
                  <option value="etudiant">{t('auth.student')}</option>
                  <option value="societe">{t('auth.company')}</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-outline-secondary" onClick={() => setEditModal(null)}>{t('common.cancel')}</button>
                <button className="btn btn-primary" onClick={handleEdit}>{t('common.save')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
