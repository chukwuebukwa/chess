import type { MoveNode } from '../chess/types';
import type { Mode } from '../chess/engine';

interface MoveListProps {
  /** The full line being drilled. */
  line: MoveNode[];
  /** Moves played so far in the current attempt. */
  breadcrumb: MoveNode[];
  mode: Mode;
  /** Whether it is currently the trainee's move. */
  awaiting: boolean;
}

interface Token {
  ply: number;
  san: string;
  cls: 'played' | 'current' | 'pending' | 'future';
}

export function MoveList({ line, breadcrumb, mode, awaiting }: MoveListProps) {
  const tokens: Token[] = [];

  breadcrumb.forEach((node, i) => {
    tokens.push({
      ply: node.ply,
      san: node.san ?? '',
      cls: i === breadcrumb.length - 1 ? 'current' : 'played',
    });
  });

  if (mode === 'drill') {
    // Hide the answer: only show a placeholder for the move to recall.
    if (awaiting) {
      tokens.push({ ply: breadcrumb.length + 1, san: '?', cls: 'pending' });
    }
  } else {
    // Learn mode: reveal the rest of the line so it can be studied.
    for (let i = breadcrumb.length; i < line.length; i += 1) {
      const node = line[i]!;
      tokens.push({ ply: node.ply, san: node.san ?? '', cls: 'future' });
    }
  }

  if (tokens.length === 0) {
    return <p className="movelist-empty">The line will appear here as you play.</p>;
  }

  return (
    <div className="movelist" aria-label="Moves played">
      {tokens.map((tok) => (
        <span key={tok.ply} className="move-token">
          {tok.ply % 2 === 1 && (
            <span className="move-number">{Math.ceil(tok.ply / 2)}.</span>
          )}
          <span className={`move-san move-${tok.cls}`}>{tok.san}</span>
        </span>
      ))}
    </div>
  );
}
