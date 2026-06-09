import { useTrainer } from './hooks/useTrainer';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TrainerBoard } from './components/TrainerBoard';
import { SidePanel } from './components/SidePanel';

export function App() {
  const trainer = useTrainer();
  const { status, opening } = trainer;

  return (
    <div className="app">
      <Sidebar trainer={trainer} />

      <div className="main">
        <Header trainer={trainer} />

        <main className="layout">
          <section className="board-col">
            <div
              className={`status-banner tone-${status.tone}`}
              role="status"
              aria-live="polite"
            >
              {status.text}
            </div>

            <div className="board-wrap">
              <TrainerBoard
                fen={trainer.fen}
                orientation={trainer.orientation}
                lastMove={trainer.lastMove}
                selected={trainer.selected}
                feedback={trainer.feedback}
                feedbackSquare={trainer.feedbackSquare}
                hintOrigin={trainer.hintOrigin}
                arrow={trainer.arrow}
                interactive={trainer.interactive}
                onPieceDrop={trainer.onPieceDrop}
                onSquareClick={trainer.onSquareClick}
                canDragPiece={trainer.canDragPiece}
              />
            </div>

            <p className="board-caption">
              {opening.name} &middot; You play{' '}
              <strong>{opening.side === 'white' ? 'White' : 'Black'}</strong> &middot;{' '}
              drag a piece or tap two squares to move.
            </p>
          </section>

          <SidePanel trainer={trainer} />
        </main>

        <footer className="footer">
          Built with{' '}
          <a href="https://github.com/jhlywa/chess.js" target="_blank" rel="noreferrer">
            chess.js
          </a>{' '}
          and{' '}
          <a
            href="https://github.com/Clariity/react-chessboard"
            target="_blank"
            rel="noreferrer"
          >
            react-chessboard
          </a>
          .
        </footer>
      </div>
    </div>
  );
}
