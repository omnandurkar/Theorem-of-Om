import { useEffect, useState } from "react";

const SANCTUM_LOCK_KEY = "kemet-sanctum-unlocked-at";
const TEN_MINUTES_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Checks if the sanctum was unlocked within the last 10 minutes.
 */
export function isSanctumUnlocked(): boolean {
  try {
    const stored = window.localStorage.getItem(SANCTUM_LOCK_KEY);
    if (!stored) return false;
    const elapsed = Date.now() - parseInt(stored, 10);
    return elapsed < TEN_MINUTES_MS;
  } catch {
    return false;
  }
}

/**
 * Custom hook to manage Om's Sanctum unlock state with 10-minute session persistence.
 * - Keeps section unlocked while tab is active/open.
 * - Remains unlocked across new tabs/reopens for 10 minutes after last activity.
 * - Instantly locks when lock() is called.
 */
export function useSanctumLock() {
  const [unlocked, setUnlocked] = useState<boolean>(() => isSanctumUnlocked());

  // While unlocked, refresh timestamp periodically (every 15s) to maintain active tab state
  useEffect(() => {
    if (!unlocked) return;

    const refreshTimestamp = () => {
      try {
        window.localStorage.setItem(SANCTUM_LOCK_KEY, Date.now().toString());
      } catch {}
    };

    // Update timestamp immediately on mount/unlock
    refreshTimestamp();

    // Keep active session timestamp updated every 15 seconds
    const interval = setInterval(refreshTimestamp, 15000);

    return () => clearInterval(interval);
  }, [unlocked]);

  const unlock = () => {
    try {
      window.localStorage.setItem(SANCTUM_LOCK_KEY, Date.now().toString());
    } catch {}
    setUnlocked(true);
  };

  const lock = () => {
    try {
      window.localStorage.removeItem(SANCTUM_LOCK_KEY);
    } catch {}
    setUnlocked(false);
  };

  return { unlocked, unlock, lock };
}
