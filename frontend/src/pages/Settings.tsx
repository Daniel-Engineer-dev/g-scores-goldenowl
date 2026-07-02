import { useTheme } from '../theme/ThemeContext';
import { THEMES } from '../theme/themes';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="page">
      <section className="card">
        <h2 className="card-title">Appearance</h2>
        <p className="muted">
          Choose a colour theme based on your favourite World Cup team. Your
          choice is saved on this device.
        </p>

        <div className="theme-grid">
          {THEMES.map((t) => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                className={`theme-card ${active ? 'theme-card--active' : ''}`}
                onClick={() => setTheme(t.id)}
                aria-pressed={active}
              >
                {active && <span className="theme-check">✓</span>}
                <div className="theme-card-head">
                  <img
                    className="theme-flag"
                    src={t.flagSrc}
                    alt={`${t.name} flag`}
                    width={32}
                    height={22}
                  />
                  <span className="theme-name">{t.name}</span>
                </div>
                <span className="theme-desc">{t.description}</span>
                <div className="theme-swatches">
                  {t.swatches.map((c) => (
                    <span
                      key={c}
                      className="theme-swatch"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
