/**
 * Style reminder — Field Notes of the Necropolis: reader controls are a compact field instrument,
 * not a generic settings panel. Retain tactile labels, quiet surfaces, and explicit local-only reassurance.
 */
import { Settings2, VolumeX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getReaderPreferences, saveReaderPreferences, type ReaderPreferences } from "@/lib/localArchive";

export function ReaderControls() {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<ReaderPreferences>(() => getReaderPreferences());

  useEffect(() => {
    document.documentElement.dataset.readerSurface = preferences.surface;
    document.documentElement.dataset.readerSize = preferences.size;
    document.documentElement.dataset.quietMotion = String(preferences.quietMotion);
    saveReaderPreferences(preferences);
  }, [preferences]);

  return (
    <div className="reader-controls">
      <button className="reader-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <Settings2 size={16} /> <span>Reader</span>
      </button>
      {open && (
          <div className="reader-panel" role="dialog" aria-label="Local reading preferences">
          <div className="reader-panel-heading">
            <span className="micro-label">LOCAL READING DESK</span>
            <span>Preferences are kept on this device.</span><button type="button" className="reader-panel-close" aria-label="Close reader preferences" onClick={() => setOpen(false)}><X size={14} /></button>
          </div>
          <label>
            <span>Reading scale</span>
            <div className="segmented-control">
              {(["compact", "standard", "large"] as const).map((size) => (
                <button key={size} onClick={() => setPreferences((current) => ({ ...current, size }))} className={preferences.size === size ? "is-active" : ""}>
                  {size === "compact" ? "A−" : size === "large" ? "A+" : "A"}
                </button>
              ))}
            </div>
          </label>
          <label>
            <span>Page surface</span>
            <div className="segmented-control surface-control">
              <button onClick={() => setPreferences((current) => ({ ...current, surface: "limestone" }))} className={preferences.surface === "limestone" ? "is-active" : ""}>Limestone</button>
              <button onClick={() => setPreferences((current) => ({ ...current, surface: "night" }))} className={preferences.surface === "night" ? "is-active" : ""}>Night ink</button>
            </div>
          </label>
          <button className="quiet-toggle" onClick={() => setPreferences((current) => ({ ...current, quietMotion: !current.quietMotion }))}>
            <VolumeX size={15} /> Quiet motion <span className={preferences.quietMotion ? "toggle-dot is-on" : "toggle-dot"} />
          </button>
        </div>
      )}
    </div>
  );
}
