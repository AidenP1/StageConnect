import { useLang } from '../context/LangContext';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { langue, changerLangue } = useLang();

  return (
    <div className="lang-switcher d-flex gap-1">
      <button
        className={`btn btn-sm ${langue === 'fr' ? 'btn-primary' : 'btn-outline-secondary'}`}
        onClick={() => changerLangue('fr')}
        title="Français"
      >
        FR
      </button>
      <button
        className={`btn btn-sm ${langue === 'en' ? 'btn-primary' : 'btn-outline-secondary'}`}
        onClick={() => changerLangue('en')}
        title="English"
      >
        EN
      </button>
      <button
        className={`btn btn-sm ${langue === 'ar' ? 'btn-primary' : 'btn-outline-secondary'}`}
        onClick={() => changerLangue('ar')}
        title="العربية"
      >
        AR
      </button>
    </div>
  );
}

export default LanguageSwitcher;
