import type { Trainer } from '../hooks/useTrainer';

export function Header({ trainer }: { trainer: Trainer }) {
  const {
    opening,
    targetName,
    mode,
    randomizeOpponent,
    setMode,
    setRandomize,
    restart,
  } = trainer;

  const opponentName = opening.side === 'white' ? 'Black' : 'White';

  return (
    <header className="topbar">
      <div className="title-block">
        <h1 className="opening-title">{opening.name}</h1>
        {targetName && <span className="variation-chip">{targetName}</span>}
        <span className={`side-badge side-${opening.side}`}>
          You play {opening.side === 'white' ? 'White' : 'Black'}
        </span>
      </div>

      <div className="controls-bar">
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
