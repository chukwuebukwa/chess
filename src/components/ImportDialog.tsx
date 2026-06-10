import { useEffect, useMemo, useRef, useState } from 'react';
import type { Trainer } from '../hooks/useTrainer';
import type { Side } from '../chess/types';
import { previewPgn } from '../chess/importOpening';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  trainer: Trainer;
}

const EXAMPLE_PGN = `1. e4 c6 2. d4 d5 3. e5 (3. Nc3 dxe4 4. Nxe4 Bf5) (3. exd5 cxd5) 3... Bf5`;

export function ImportDialog({ open, onClose, trainer }: ImportDialogProps) {
  const [name, setName] = useState('');
  const [side, setSide] = useState<Side>('white');
  const [pgn, setPgn] = useState('');
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => previewPgn(pgn), [pgn]);

  useEffect(() => {
    if (open) {
      setError(null);
      nameRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const reset = () => {
    setName('');
    setSide('white');
    setPgn('');
    setError(null);
  };
  const close = () => {
    reset();
    onClose();
  };

  const canImport = preview.ok && name.trim().length > 0;

  const submit = () => {
    const result = trainer.importOpening({ name, side, pgn });
    if (result.ok) {
      close();
    } else {
      setError(result.error);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={close}
      onKeyDown={(e) => e.key === 'Escape' && close()}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Import an opening from PGN"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 className="modal-title">Import opening from PGN</h2>
          <button type="button" className="modal-x" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>

        <p className="modal-hint">
          Paste a PGN. Each nested <code>( )</code> variation becomes its own
          drillable line; every move is checked for legality before importing.
        </p>

        <div className="modal-fields">
          <label className="field modal-field">
            <span className="field-label">Name</span>
            <input
              ref={nameRef}
              className="input"
              value={name}
              placeholder="e.g. My Caro-Kann"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="field">
            <span className="field-label">You play</span>
            <div className="segmented" role="group" aria-label="Side">
              <button
                type="button"
                className={side === 'white' ? 'seg seg-active' : 'seg'}
                onClick={() => setSide('white')}
              >
                White
              </button>
              <button
                type="button"
                className={side === 'black' ? 'seg seg-active' : 'seg'}
                onClick={() => setSide('black')}
              >
                Black
              </button>
            </div>
          </div>
        </div>

        <label className="field modal-field">
          <span className="field-label">PGN</span>
          <textarea
            className="pgn-input"
            value={pgn}
            spellCheck={false}
            placeholder={EXAMPLE_PGN}
            onChange={(e) => setPgn(e.target.value)}
            rows={7}
          />
        </label>

        <div className="modal-preview">
          {!pgn.trim() ? (
            <span className="preview-muted">
              Tip: paste a line with variations like{' '}
              <code>1.e4 c6 2.d4 d5 3.e5 (3.exd5 cxd5) 3...Bf5</code>
            </span>
          ) : preview.ok ? (
            <div className="preview-ok">
              <span className="preview-badge">
                ✓ {preview.lines} {preview.lines === 1 ? 'line' : 'lines'} ·{' '}
                {preview.moves} moves
              </span>
              <div className="preview-names">
                {preview.names.slice(0, 8).map((n, i) => (
                  <span key={`${n}-${i}`} className="preview-chip">
                    {n}
                  </span>
                ))}
                {preview.names.length > 8 && (
                  <span className="preview-chip">+{preview.names.length - 8}</span>
                )}
              </div>
            </div>
          ) : (
            <span className="preview-error">⚠ {preview.error}</span>
          )}
        </div>

        {error && <p className="preview-error modal-error">⚠ {error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={close}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={submit}
            disabled={!canImport}
          >
            Import opening
          </button>
        </div>
      </div>
    </div>
  );
}
