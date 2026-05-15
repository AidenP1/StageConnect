import { useTheme } from '../context/ThemeContext';

function DarkModeToggle() {
  const { modeSombre, basculerTheme } = useTheme();

  return (
    <button
      className="btn btn-sm btn-outline-secondary"
      onClick={basculerTheme}
      title={modeSombre ? 'Mode clair' : 'Mode sombre'}
      style={{ padding: '4px 8px' }}
    >
      {modeSombre ? (
        <i className="fas fa-sun"></i>
      ) : (
        <i className="fas fa-moon"></i>
      )}
    </button>
  );
}

export default DarkModeToggle;
