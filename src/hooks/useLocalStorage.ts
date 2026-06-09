import { useCallback, useState } from 'react';

type Updater<T> = T | ((prev: T) => T);

/**
 * `useState` that mirrors its value to localStorage. Reads are lazy and guarded
 * so the app still works if storage is unavailable (private mode, SSR, etc.).
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (updater: Updater<T>) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (updater: Updater<T>) => {
      setValue((prev) => {
        const next =
          typeof updater === 'function'
            ? (updater as (p: T) => T)(prev)
            : updater;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Ignore write failures — persistence is a nicety, not a requirement.
        }
        return next;
      });
    },
    [key],
  );

  return [value, set];
}
