import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMesConversations, getConversation, envoyerMessage } from '../../api/messages';
import { formaterDate } from '../../utils/helpers';
import Sidebar from '../../components/Sidebar';
import '../etudiant/Messages.css';

function SocieteMessages() {
  const { interlocuteurId } = useParams();
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  const endRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [interlocuteur, setInterlocuteur] = useState(null);
  const [texte, setTexte] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    getMesConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  useEffect(() => {
    if (!interlocuteurId) return;
    setMessages([]);
    getConversation(interlocuteurId).then((data) => {
      setMessages(data.messages);
      setInterlocuteur(data.interlocuteur);
      setConversations((prev) =>
        prev.map((c) =>
          String(c.interlocuteur_id) === String(interlocuteurId)
            ? { ...c, non_lus: 0 }
            : c
        )
      );
    });
  }, [interlocuteurId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEnvoyer = async (e) => {
    e.preventDefault();
    if (!texte.trim()) return;
    setEnvoi(true);
    try {
      const data = await envoyerMessage(interlocuteurId, texte.trim());
      setMessages((prev) => [...prev, data.data]);
      setTexte('');
    } catch {
      // ignorer
    } finally {
      setEnvoi(false);
    }
  };

  const getNom = (conv) => {
    const u = conv.interlocuteur;
    return u?.etudiant_profile?.filiere
      ? `${u.name} — ${u.etudiant_profile.filiere}`
      : u?.name || 'Inconnu';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content p-0">
        <div className="messages-layout">

          {/* liste conversations */}
          <div className="conv-list">
            <div className="conv-list-header">
              <h5 className="mb-0">Messages</h5>
            </div>
            {chargement ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary"></div>
              </div>
            ) : conversations.length === 0 ? (
              <p className="conv-empty">Aucune conversation.</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.interlocuteur_id}
                  className={`conv-item ${String(conv.interlocuteur_id) === String(interlocuteurId) ? 'active' : ''}`}
                  onClick={() => navigate(`/societe/messages/${conv.interlocuteur_id}`)}
                >
                  <div className="conv-avatar">
                    {(conv.interlocuteur?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="conv-info">
                    <div className="conv-name">{conv.interlocuteur?.name}</div>
                    <div className="conv-preview">{conv.dernier_message}</div>
                  </div>
                  {conv.non_lus > 0 && (
                    <span className="conv-badge">{conv.non_lus}</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* zone chat */}
          <div className="chat-zone">
            {!interlocuteurId ? (
              <div className="chat-empty">
                <i className="fas fa-comments fa-3x mb-3" style={{ color: 'var(--border)' }}></i>
                <p className="text-muted">Sélectionnez une conversation</p>
              </div>
            ) : (
              <>
                <div className="chat-header">
                  {interlocuteur && (
                    <>
                      <div className="conv-avatar sm">
                        {interlocuteur.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="chat-header-name">{interlocuteur.name}</div>
                        <small className="text-muted">
                          {interlocuteur.etudiant_profile?.filiere || interlocuteur.email}
                        </small>
                      </div>
                    </>
                  )}
                </div>

                <div className="chat-messages">
                  {messages.map((msg) => {
                    const estMoi = msg.sender_id === utilisateur?.id;
                    return (
                      <div key={msg.id} className={`msg-row ${estMoi ? 'sent' : 'received'}`}>
                        <div className="msg-bubble">
                          {msg.stage && (
                            <div className="msg-stage-tag">
                              <i className="fas fa-briefcase me-1"></i>{msg.stage.title}
                            </div>
                          )}
                          <p className="mb-0">{msg.content}</p>
                          <span className="msg-time">{formaterDate(msg.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>

                <form className="chat-input-bar" onSubmit={handleEnvoyer}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Écrivez un message..."
                    value={texte}
                    onChange={(e) => setTexte(e.target.value)}
                    autoComplete="off"
                  />
                  <button type="submit" className="btn btn-primary" disabled={envoi || !texte.trim()}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SocieteMessages;
