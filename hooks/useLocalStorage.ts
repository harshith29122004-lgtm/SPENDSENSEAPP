import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export function useLocalStorage<T,>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item === null ? initialValue : (JSON.parse(item) as T);
    } catch {
      // Storage may be unavailable or contain invalid JSON.
      return initialValue;
    }
  });

  // React applies functional updates against the latest state, avoiding stale closures.
  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    setStoredValue(value);
  };

  // Persist committed state changes. Storage failures must not break the UI.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // The app remains usable for this session when storage is unavailable/full.
    }
  }, [key, storedValue]);

  // Keep other tabs in sync. A removed key resets this tab to the supplied default.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return;

      if (event.newValue === null) {
        setStoredValue(initialValue);
        return;
      }

      try {
        setStoredValue(JSON.parse(event.newValue) as T);
      } catch {
        // Ignore malformed cross-tab updates instead of crashing the React tree.
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
