import type { Trainer } from '../hooks/useTrainer';

export function OpeningBar({ trainer }: { trainer: Trainer }) {
  const {
    openings,
    openingId,
    opening,
    mode,
    randomizeOpponent,
    selectOpening,
    setMode,
    setRandomize,
    restart,
  } = trainer;

  const opponentName = opening.side === 'white' ? 'Black' : 'White';

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden>
          ♞
        </span>
        <div>
          <h1 className="brand-title">Opening Trainer</h1>
          <p className="brand-sub">Drill openings and their variations, move by move.</p>
        </div>
      </div>

      <div className="controls-bar">
        <label className="field">
          <span className="field-label">Opening</span>
          <select
            className="select"
            value={openingId}
            onChange={(e) => selectOpening(e.target.value)}
          >
            {openings.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.side === 'white' ? 'White' : 'Black'})
              </option>
            ))}
          </select>
        </label>

        <div className="field">
          <span className="field-label">Mode</span>
          <div className="segmented" role="group" aria-label="Training mode">
            <button
              type="button"
              className={mode === 'learn' ? 'seg seg-active' : 'seg'}
              onClick={() => setMode('learn')}
            >
              Learn
            </button>
            <button
              type="button"
              className={mode === 'drill' ? 'seg seg-active' : 'seg'}
              onClick={() => setMode('drill')}
            >
              Drill
            </button>
          </div>
        </div>

        <label className="field check-field">
          <span className="field-label">{opponentName}&rsquo;s replies</span>
          <span className="check-row">
            <input
              type="checkbox"
              checked={randomizeOpponent}
              onChange={(e) => setRandomize(e.target.checked)}
            />
            <span>Shuffle</span>
          </span>
        </label>

        <button type="button" className="btn btn-ghost" onClick={restart}>
          Restart
        </button>
      </div>
    </header>
  );
}
