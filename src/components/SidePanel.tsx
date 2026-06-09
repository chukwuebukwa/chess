import type { Trainer } from '../hooks/useTrainer';
import { MoveList } from './MoveList';

export function SidePanel({ trainer }: { trainer: Trainer }) {
  const {
    state,
    mode,
    interactive,
    targetName,
    comment,
    line,
    breadcrumb,
    totalLines,
    completedCount,
    accuracyPct,
    streak,
    bestStreak,
    hint,
    reveal,
    doNextLine,
    doResetLine,
    restart,
    resetProgress,
  } = trainer;

  const phase = state.phase;
  const lineDone = phase === 'lineComplete';
  const repertoireDone = phase === 'repertoireComplete';
  const progressPct = totalLines === 0 ? 0 : Math.round((completedCount / totalLines) * 100);

  return (
    <aside className="panel">
      <section className="panel-card">
        <div className="line-heading">
          <span className="line-eyebrow">{mode === 'drill' ? 'Drilling' : 'Studying'}</span>
          <h2 className="line-name">{targetName || 'Opening'}</h2>
        </div>

        <div className="action-grid">
          <button
            type="button"
            className="btn"
            onClick={hint}
            disabled={!interactive}
            title="Highlight the piece to move, then its destination"
          >
            💡 Hint
          </button>
          <button
            type="button"
            className="btn"
            onClick={reveal}
            disabled={!interactive}
            title="Play the correct move for me"
          >
            👁 Show move
          </button>
          <button type="button" className="btn" onClick={doResetLine}>
            ↺ Reset line
          </button>
          {repertoireDone ? (
            <button type="button" className="btn btn-primary" onClick={restart}>
              ⟳ Start over
            </button>
          ) : (
            <button
              type="button"
              className={lineDone ? 'btn btn-primary' : 'btn'}
              onClick={doNextLine}
            >
              {lineDone ? 'Next line →' : 'Skip →'}
            </button>
          )}
        </div>

        {(lineDone || mode === 'learn') && comment && (
          <p className="teach-note">{comment}</p>
        )}
      </section>

      <section className="panel-card">
        <h3 className="card-title">Moves</h3>
        <MoveList
          line={line}
          breadcrumb={breadcrumb}
          mode={mode}
          awaiting={interactive}
        />
      </section>

      <section className="panel-card">
        <h3 className="card-title">Progress</h3>
        <div className="progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="progress-label">
            {completedCount} / {totalLines} lines
          </span>
        </div>

        <div className="stat-row">
          <div className="stat">
            <span className="stat-value">{accuracyPct}%</span>
            <span className="stat-key">Accuracy</span>
          </div>
          <div className="stat">
            <span className="stat-value">{streak}</span>
            <span className="stat-key">Streak</span>
          </div>
          <div className="stat">
            <span className="stat-value">{bestStreak}</span>
            <span className="stat-key">Best</span>
          </div>
        </div>

        <button type="button" className="link-btn" onClick={resetProgress}>
          Reset saved progress for this opening
        </button>
      </section>
    </aside>
  );
}
