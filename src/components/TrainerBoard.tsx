import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Chessboard } from 'react-chessboard';
import type {
  Arrow,
  PieceDropHandlerArgs,
  PieceHandlerArgs,
  SquareHandlerArgs,
} from 'react-chessboard';
import type { Square } from 'chess.js';
import type { FeedbackKind } from '../chess/engine';
import type { Side } from '../chess/types';

interface TrainerBoardProps {
  fen: string;
  orientation: Side;
  lastMove: { from: Square; to: Square } | null;
  selected: Square | null;
  feedback: FeedbackKind;
  feedbackSquare: Square | null;
  hintOrigin: Square | null;
  arrow: { from: Square; to: Square } | null;
  interactive: boolean;
  onPieceDrop: (args: PieceDropHandlerArgs) => boolean;
  onSquareClick: (args: SquareHandlerArgs) => void;
  canDragPiece: (args: PieceHandlerArgs) => boolean;
}

const HIGHLIGHT = {
  lastMove: 'rgba(255, 213, 79, 0.45)',
  selected: 'rgba(56, 142, 255, 0.5)',
  correct: 'rgba(76, 175, 80, 0.75)',
  wrong: 'rgba(229, 57, 53, 0.75)',
  revealed: 'rgba(124, 77, 255, 0.6)',
  hintRing: 'inset 0 0 0 4px rgba(245, 165, 0, 0.95)',
} as const;

export function TrainerBoard(props: TrainerBoardProps) {
  const {
    fen,
    orientation,
    lastMove,
    selected,
    feedback,
    feedbackSquare,
    hintOrigin,
    arrow,
    interactive,
    onPieceDrop,
    onSquareClick,
    canDragPiece,
  } = props;

  const squareStyles = useMemo<Record<string, CSSProperties>>(() => {
    const styles: Record<string, CSSProperties> = {};
    const set = (sq: Square | null, style: CSSProperties) => {
      if (!sq) return;
      styles[sq] = { ...styles[sq], ...style };
    };

    if (lastMove) {
      set(lastMove.from, { backgroundColor: HIGHLIGHT.lastMove });
      set(lastMove.to, { backgroundColor: HIGHLIGHT.lastMove });
    }
    set(hintOrigin, { boxShadow: HIGHLIGHT.hintRing });
    set(selected, { backgroundColor: HIGHLIGHT.selected });

    if (feedback === 'correct') set(feedbackSquare, { backgroundColor: HIGHLIGHT.correct });
    else if (feedback === 'wrong') set(feedbackSquare, { backgroundColor: HIGHLIGHT.wrong });
    else if (feedback === 'revealed') set(feedbackSquare, { backgroundColor: HIGHLIGHT.revealed });

    return styles;
  }, [lastMove, selected, feedback, feedbackSquare, hintOrigin]);

  const arrows = useMemo<Arrow[]>(
    () =>
      arrow
        ? [{ startSquare: arrow.from, endSquare: arrow.to, color: '#f5a500' }]
        : [],
    [arrow],
  );

  const options = {
    id: 'trainer-board',
    position: fen,
    boardOrientation: orientation,
    onPieceDrop,
    onSquareClick,
    canDragPiece,
    allowDragging: interactive,
    squareStyles,
    arrows,
    animationDurationInMs: 250,
    darkSquareStyle: { backgroundColor: '#6f8f5d' },
    lightSquareStyle: { backgroundColor: '#eeeed2' },
    boardStyle: {
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45)',
    },
  };

  return <Chessboard options={options} />;
}
