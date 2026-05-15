function RatingStars({ note, max = 5, taille = 'normal' }) {
  const etoiles = [];

  for (let i = 1; i <= max; i++) {
    if (i <= note) {
      etoiles.push(<i key={i} className="fas fa-star text-warning"></i>);
    } else if (i - 0.5 <= note) {
      etoiles.push(<i key={i} className="fas fa-star-half-alt text-warning"></i>);
    } else {
      etoiles.push(<i key={i} className="far fa-star text-warning"></i>);
    }
  }

  const style = taille === 'small' ? { fontSize: '0.85rem' } : {};

  return (
    <span className="rating-stars" style={style}>
      {etoiles}
      {note > 0 && <span className="ms-1 text-muted" style={{ fontSize: '0.85em' }}>({note}/5)</span>}
    </span>
  );
}

export default RatingStars;
