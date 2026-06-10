import { useCallback, useMemo } from 'react';
import type { Opening, Side } from '../chess/types';
import { buildTree } from '../chess/tree';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'opening-trainer:custom-openings';

/** Cheap structural + legality guard for an opening loaded from storage. */
function isValidOpening(value: unknown): value is Opening {
  if (!value || typeof value !== 'object') return false;
  const o = value as Partial<Opening>;
  const side: Side | undefined = o.side;
  if (
    typeof o.id !== 'string' ||
    typeof o.name !== 'string' ||
    (side !== 'white' && side !== 'black') ||
    !Array.isArray(o.lines) ||
    o.lines.length === 0
  ) {
    return false;
  }
  try {
    buildTree(o.lines); // rejects anything that no longer compiles to a legal tree
    return true;
  } catch {
    return false;
  }
}

/**
 * Persisted user-imported openings. Stored as plain `Opening` JSON (the whole
 * type is serialisable) and re-validated on load so a corrupt or outdated entry
 * can never crash the trainer.
 */
export function useCustomOpenings() {
  const [stored, setStored] = useLocalStorage<Opening[]>(STORAGE_KEY, []);

  const customOpenings = useMemo(
    () => (Array.isArray(stored) ? stored.filter(isValidOpening) : []),
    [stored],
  );

  const addOpening = useCallback(
    (opening: Opening) => {
      setStored((prev) => [...prev.filter((o) => o.id !== opening.id), opening]);
    },
    [setStored],
  );

  const removeOpening = useCallback(
    (id: string) => {
      setStored((prev) => prev.filter((o) => o.id !== id));
    },
    [setStored],
  );

  return { customOpenings, addOpening, removeOpening };
}
