// fonctions utilitaires pour l'application

// formater une date en format lisible
export function formaterDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// tronquer un texte long
export function tronquer(texte, longueur = 100) {
  if (!texte) return '';
  if (texte.length <= longueur) return texte;
  return texte.substring(0, longueur) + '...';
}

// obtenir l'URL d'une image stockée
export function getImageUrl(chemin) {
  if (!chemin) return null;
  const base = import.meta.env.VITE_STORAGE_URL || import.meta.env.VITE_API_URL || '';
  return `${base}/storage/${chemin}`;
}

// calculer si une date est dépassée
export function estExpire(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const maintenant = new Date();
  return date < maintenant;
}

// badge couleur selon le statut d'une candidature
export function getBadgeStatut(statut) {
  switch (statut) {
    case 'accepte':
      return 'success';
    case 'refuse':
      return 'danger';
    case 'en_attente':
    default:
      return 'warning';
  }
}

// label français pour le statut
export function getLabelStatut(statut, t) {
  switch (statut) {
    case 'accepte':
      return t('candidatures.accepte');
    case 'refuse':
      return t('candidatures.refuse');
    default:
      return t('candidatures.en_attente');
  }
}
