import type { Trainer } from '../hooks/useTrainer';

export function Sidebar({ trainer }: { trainer: Trainer }) {
  const { openingSummaries, openingId, selectOpening } = trainer;

  return (
    <nav className="sidebar" aria-label="Openings">
      <div className="sidebar-brand">
        <span className="brand-mark" aria-hidden>
          ♞
        </span>
        <div className="sidebar-brand-text">
          <span className="brand-title">Opening Trainer</span>
          <span className="brand-sub">Drill openings move by move</span>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">Openings</span>
        <ul className="opening-nav">
          {openingSummaries.map((o) => {
            const active = o.id === openingId;
            const done = o.completed >= o.total && o.total > 0;
            return (
              <li key={o.id}>
                <button
                  type="button"
                  className={active ? 'opening-item active' : 'opening-item'}
                  aria-current={active ? 'true' : undefined}
                  onClick={() => selectOpening(o.id)}
                >
                  <span className="opening-item-main">
                    <span className="opening-item-name">{o.name}</span>
                    <span className={`side-badge side-${o.side}`}>
                      {o.side === 'white' ? 'White' : 'Black'}
                    </span>
                  </span>
                  <span className="opening-item-progress">
                    {done && <span className="done-check" aria-hidden>✓</span>}
                    {o.completed}/{o.total} lines
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="sidebar-foot">More openings coming soon.</p>
    </nav>
  );
}
