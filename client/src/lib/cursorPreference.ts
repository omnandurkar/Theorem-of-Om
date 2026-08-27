export const CURSOR_PREFERENCE_KEY = "theorem-of-kemet.custom-cursor";
export const CURSOR_PREFERENCE_EVENT = "kemet:cursor-preference";

export function readCustomCursorPreference() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CURSOR_PREFERENCE_KEY) === "enabled";
}

export function writeCustomCursorPreference(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CURSOR_PREFERENCE_KEY, enabled ? "enabled" : "disabled");
  window.dispatchEvent(new CustomEvent(CURSOR_PREFERENCE_EVENT, { detail: enabled }));
}
