// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Integration smoke tests for the whole app. `react-chessboard` is mocked with a
 * stub that captures the latest `options` it receives, so these tests exercise
 * the real engine + hook + component wiring (the bug-prone glue) and prove the
 * app mounts and reacts to moves — without needing a real browser/DOM canvas.
 */
let latestOptions: {
  position: string;
  boardOrientation: string;
  onPieceDrop: (args: {
    piece: { pieceType: string; isSparePiece: boolean; position: string };
    sourceSquare: string;
    targetSquare: string | null;
  }) => boolean;
} | null = null;

vi.mock('react-chessboard', () => ({
  Chessboard: ({ options }: { options: typeof latestOptions }) => {
    latestOptions = options;
    return (
      <div
        data-testid="board"
        data-fen={options?.position}
        data-orientation={options?.boardOrientation}
      />
    );
  },
}));

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';

beforeEach(() => {
  vi.useFakeTimers();
  latestOptions = null;
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('App integration', () => {
  it('mounts and renders the trainer shell', () => {
    render(<App />);
    expect(screen.getByText('Opening Trainer')).toBeTruthy();
    expect(screen.getByTestId('board')).toBeTruthy();
    // Caro-Kann is the default: the trainee is Black and White moves first.
    expect(latestOptions?.boardOrientation).toBe('black');
  });

  it('accepts the trainee’s correct first move (Italian, White to move)', () => {
    render(<App />);

    // Switch to the Italian so the trainee (White) is to move immediately,
    // avoiding the opponent's reply timer.
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Italian Game/i }));
    });
    expect(latestOptions?.boardOrientation).toBe('white');

    const startFen = latestOptions!.position;

    // Play 1.e4 by invoking the captured drop handler.
    let accepted = false;
    act(() => {
      accepted = latestOptions!.onPieceDrop({
        piece: { pieceType: 'wP', isSparePiece: false, position: 'e2' },
        sourceSquare: 'e2',
        targetSquare: 'e4',
      });
    });

    expect(accepted).toBe(true);
    expect(latestOptions!.position).not.toBe(startFen);
    expect(latestOptions!.position).toContain(' b '); // Black to move after 1.e4
    expect(screen.getByText(/Correct!/)).toBeTruthy();
  });

  it('rejects an off-book first move', () => {
    render(<App />);
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Italian Game/i }));
    });

    const startFen = latestOptions!.position;
    let accepted = true;
    act(() => {
      accepted = latestOptions!.onPieceDrop({
        piece: { pieceType: 'wP', isSparePiece: false, position: 'a2' },
        sourceSquare: 'a2',
        targetSquare: 'a3', // legal, but not the book move
      });
    });

    expect(accepted).toBe(false);
    expect(latestOptions!.position).toBe(startFen); // board unchanged
    expect(screen.getByText(/try again/i)).toBeTruthy();
  });

  it('imports a pasted PGN as a new custom opening', () => {
    render(<App />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Import from PGN/i }));
    });

    const [nameInput, pgnInput] = screen.getAllByRole('textbox');
    act(() => {
      fireEvent.change(nameInput!, { target: { value: 'My Line' } });
      fireEvent.change(pgnInput!, { target: { value: '1. e4 e5 2. Nf3 Nc6' } });
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Import opening/i }));
    });

    // The dialog closes, the new opening is selected (header) and listed (sidebar).
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getAllByText('My Line').length).toBeGreaterThanOrEqual(1);

    // And it is persisted to localStorage so it survives a reload.
    const stored = JSON.parse(
      localStorage.getItem('opening-trainer:custom-openings') ?? '[]',
    );
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('my-line');
  });
});
