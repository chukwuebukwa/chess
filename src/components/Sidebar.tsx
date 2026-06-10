import { useMemo, useState } from 'react';
import type { Trainer } from '../hooks/useTrainer';
import type { Side } from '../chess/types';

interface SidebarProps {
  trainer: Trainer;
  onImport: () => void;
}

type OpeningSummary = Trainer['openingSummaries'][number];

const GROUP_LABEL: Record<Side, string> = { white: 'White', black: 'Black' };
const GROUP_ORDER: Side[] = ['black', 'white'];

export function Sidebar({ trainer, onImport }: SidebarProps) {
  const {
    openingSummaries,
    openingId,
    selectOpening,
    lineSummaries,
    targetLeafId,
    selectLine,
    deleteOpening,
  } = trainer;

  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<Side, boolean>>({
    white: false,
    black: false,
  });

  const searching = query.trim().length > 0;
  const needle = query.trim().toLowerCase();

  const groups = useMemo(() => {
    const bySide: Record<Side, OpeningSummary[]> = { white: [], black: [] };
    for (const o of openingSummaries) bySide[o.side].push(o);
    return bySide;
  }, [openingSummaries]);

  const matches = (o: OpeningSummary) => !searching || o.name.toLowerCase().includes(needle);
  const totalMatches = openingSummaries.filter(matches).length;

  const toggle = (side: Side) =>
    setCollapsed((prev) => ({ ...prev, [side]: !prev[side] }));

  const renderOpening = (o: OpeningSummary) => {
    const active = o.id === openingId;
    const done = o.completed >= o.total && o.total > 0;
    return (
      <li key={o.id} className="opening-li">
        <button
          type="button"
          className={active ? 'opening-item active' : 'opening-item'}
          aria-current={active ? 'true' : undefined}
          onClick={() => selectOpening(o.id)}
        >
          <span className="opening-item-main">
            <span className="opening-item-name">{o.name}</span>
            {o.custom && <span className="custom-tag">imported</span>}
          </span>
          <span className="opening-item-progress">
            {done && <span className="done-check" aria-hidden>✓</span>}
            {o.completed}/{o.total} lines
          </span>
        </button>

        {o.custom && (
          <button
            type="button"
            className="opening-delete"
            title="Delete this imported opening"
            aria-label={`Delete ${o.name}`}
            onClick={() => {
              if (
                typeof window === 'undefined' ||
                window.confirm(`Delete imported opening "${o.name}"?`)
              ) {
                deleteOpening(o.id);
              }
            }}
          >
            ✕
          </button>
        )}

        {active && lineSummaries.length > 0 && (
          <ul className="line-nav" aria-label={`${o.name} lines`}>
            {lineSummaries.map((line) => {
              const current = line.id === targetLeafId;
              return (
                <li key={line.id}>
                  <button
                    type="button"
                    className={current ? 'line-item active' : 'line-item'}
                    aria-current={current ? 'true' : undefined}
                    onClick={() => selectLine(line.id)}
                  >
                    <span className="line-item-name">{line.name}</span>
                    {line.completed && <span className="done-check" aria-hidden>✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

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

      <div className="sidebar-search">
        <input
          className="search-input"
          type="search"
          value={query}
          placeholder="Search openings…"
          aria-label="Search openings"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="sidebar-scroll">
        {GROUP_ORDER.map((side) => {
          const all = groups[side];
          const visible = all.filter(matches);
          if (visible.length === 0) return null;

          const completed = all.reduce((s, o) => s + o.completed, 0);
          const total = all.reduce((s, o) => s + o.total, 0);
          const open = !collapsed[side] || searching;

          return (
            <section className="opening-group" key={side}>
              <button
                type="button"
                className="group-header"
                aria-expanded={open}
                onClick={() => toggle(side)}
                disabled={searching}
              >
                <span className="group-caret" aria-hidden>
                  {open ? '▾' : '▸'}
                </span>
                <span className="group-title">{GROUP_LABEL[side]}</span>
                <span className="group-progress">
                  {completed}/{total}
                </span>
              </button>
              {open && <ul className="opening-nav">{visible.map(renderOpening)}</ul>}
            </section>
          );
        })}

        {totalMatches === 0 && (
          <p className="sidebar-empty">No openings match “{query}”.</p>
        )}
      </div>

      <button type="button" className="import-btn" onClick={onImport}>
        ＋ Import from PGN
      </button>
    </nav>
  );
}
