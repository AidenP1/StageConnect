import { useState, useEffect } from 'react';
import { getMesNotifications } from '../api/notifications';
import { formaterDate } from '../utils/helpers';
import './NotificationBell.css';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [nonLues, setNonLues] = useState(0);
  const [ouvert, setOuvert] = useState(false);

  // récupérer les notifications au chargement
  useEffect(() => {
    chargerNotifications();
  }, []);

  const chargerNotifications = async () => {
    try {
      const data = await getMesNotifications();
      setNotifications(data);
      const count = data.filter((n) => !n.is_read).length;
      setNonLues(count);
    } catch (err) {
      // ignorer si pas connecté
    }
  };

  const toggleDropdown = () => {
    setOuvert((prev) => !prev);
    if (!ouvert) {
      setNonLues(0);
    }
  };

  return (
    <div className="notif-bell-wrapper">
      <button className="btn btn-sm btn-outline-secondary position-relative" onClick={toggleDropdown}>
        <i className="fas fa-bell"></i>
        {nonLues > 0 && (
          <span className="badge bg-danger notif-badge">{nonLues}</span>
        )}
      </button>

      {ouvert && (
        <div className="notif-dropdown card-custom">
          <div className="notif-header">
            <strong>Notifications</strong>
            <button className="btn-close-notif" onClick={() => setOuvert(false)}>×</button>
          </div>
          {notifications.length === 0 ? (
            <p className="notif-empty">Aucune notification.</p>
          ) : (
            <ul className="notif-list">
              {notifications.slice(0, 8).map((notif) => (
                <li key={notif.id} className={`notif-item ${!notif.is_read ? 'non-lue' : ''}`}>
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-date">{formaterDate(notif.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
