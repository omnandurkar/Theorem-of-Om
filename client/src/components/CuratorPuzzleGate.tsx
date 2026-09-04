import { Command, Compass, KeyRound, LockKeyhole, Orbit, RotateCcw, Sparkles, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { CURATOR_RELICS, type CuratorRelicId } from "@shared/curatorPuzzles";
import "./curatorPuzzleGate.css";

const PASSWORD_KEY = "kemet-curator-password";

type Mode = "ring" | "constellation" | "relic";

// Constellation star nodes
const ORION_STARS = [
  { id: "alnitak", name: "Alnitak", x: 80, y: 140, isSolution: true, order: 0 },
  { id: "alnilam", name: "Alnilam", x: 170, y: 120, isSolution: true, order: 1 },
  { id: "mintaka", name: "Mintaka", x: 260, y: 100, isSolution: true, order: 2 },
  { id: "sirius", name: "Sirius", x: 280, y: 220, isSolution: false, order: -1 },
  { id: "sphinx", name: "Sphinx", x: 170, y: 230, isSolution: true, order: 3 },
  { id: "thuban", name: "Thuban", x: 60, y: 50, isSolution: false, order: -1 },
];

export function CuratorPuzzleGate({ onUnlocked }: { onUnlocked: () => void }) {
  const [mode, setMode] = useState<Mode>("ring");
  const [showOverride, setShowOverride] = useState(false);
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [unsealing, setUnsealing] = useState(false);
  const [isInsaneSpinning, setIsInsaneSpinning] = useState(false);
  const [lightBeamActive, setLightBeamActive] = useState(false);

  // ── Mode 1: Ring Dial State (Rotations in degrees) ──────────────────────────
  const [outerAngle, setOuterAngle] = useState(180); // Target: 0 (Orion at Top)
  const [middleAngle, setMiddleAngle] = useState(270); // Target: 0 (Djed at Top)
  const [innerAngle, setInnerAngle] = useState(90);   // Target: 0 (Lapis at Top)

  // Check ring alignment (All 3 target emblems must align at 12 o'clock / 0 deg)
  useEffect(() => {
    if (mode === "ring" && !unsealing) {
      const oNormalized = (outerAngle % 360 + 360) % 360;
      const mNormalized = (middleAngle % 360 + 360) % 360;
      const iNormalized = (innerAngle % 360 + 360) % 360;
      if (oNormalized === 0 && mNormalized === 0 && iNormalized === 0) {
        triggerInsaneUnlock();
      }
    }
  }, [outerAngle, middleAngle, innerAngle, mode, unsealing]);

  // ── Mode 2: Constellation Star Trace State ───────────────────────────────
  const [starPath, setStarPath] = useState<string[]>([]);
  const targetStarOrder = ["alnitak", "alnilam", "mintaka", "sphinx"];

  const handleStarClick = (id: string) => {
    if (starPath.includes(id) || unsealing) return;
    const nextPath = [...starPath, id];
    setStarPath(nextPath);
    setNotice("");

    if (nextPath.length === targetStarOrder.length) {
      if (nextPath.every((star, idx) => star === targetStarOrder[idx])) {
        triggerInsaneUnlock();
      } else {
        setNotice("The stars misalignment disrupts the energy matrix.");
        setTimeout(() => setStarPath([]), 800);
      }
    }
  };

  // ── Mode 3: Relic Sequence State ──────────────────────────────────────────
  const [relicSeq, setRelicSeq] = useState<CuratorRelicId[]>([]);
  const relicSolution: CuratorRelicId[] = ["djed", "eye", "ankh", "scarab"];

  const handleRelicSelect = (id: CuratorRelicId) => {
    if (relicSeq.includes(id) || unsealing) return;
    const nextSeq = [...relicSeq, id];
    setRelicSeq(nextSeq);
    setNotice("");

    if (nextSeq.length === relicSolution.length) {
      if (nextSeq.every((rel, idx) => rel === relicSolution[idx])) {
        triggerInsaneUnlock();
      } else {
        setNotice("The mechanism resists. Reconsider the order.");
        setTimeout(() => setRelicSeq([]), 800);
      }
    }
  };

  // Trigger insane dial spin, cosmic light beam, and open Personal Edit Room
  const triggerInsaneUnlock = () => {
    setUnsealing(true);
    setIsInsaneSpinning(true);

    // Spin dial angles insanely
    setOuterAngle((prev) => prev + 2160);
    setMiddleAngle((prev) => prev - 2880);
    setInnerAngle((prev) => prev + 3600);

    // Activate light beam after initial spin acceleration
    setTimeout(() => {
      setLightBeamActive(true);
    }, 600);

    // Complete transition to Personal Edit Room
    setTimeout(() => {
      onUnlocked();
    }, 2200);
  };

  // ⌘/Ctrl + K shortcut for password bypass
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowOverride(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePasswordUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = window.localStorage.getItem(PASSWORD_KEY) || "Pass@123";
    if (password === stored) {
      setShowOverride(false);
      triggerInsaneUnlock();
    } else {
      setNotice("That password did not wake the mechanism.");
    }
  };

  return (
    <main className="puzzle-gate-v2">
      <div className="puzzle-stars-bg" />

      {/* Prominent Curator Plate featuring Om Nandurkar */}
      <div className="om-curator-header-badge">
        <span className="badge-seal">𓂀</span>
        <div className="badge-text">
          <small>FOUNDER &amp; CHIEF KEEPER</small>
          <strong>OM NANDURKAR</strong>
          <span className="badge-sub">DESK SANCTUM VAULT</span>
        </div>
        <span className="badge-seal">𓋹</span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="puzzle-mode-switcher">
        <button
          type="button"
          className={`mode-tab-btn ${mode === "ring" ? "active" : ""}`}
          onClick={() => { setMode("ring"); setNotice(""); }}
        >
          <Orbit size={14} /> Ring Vault
        </button>
        <button
          type="button"
          className={`mode-tab-btn ${mode === "constellation" ? "active" : ""}`}
          onClick={() => { setMode("constellation"); setNotice(""); }}
        >
          <Star size={14} /> Star Matrix
        </button>
        <button
          type="button"
          className={`mode-tab-btn ${mode === "relic" ? "active" : ""}`}
          onClick={() => { setMode("relic"); setNotice(""); }}
        >
          <Compass size={14} /> Relic Tablets
        </button>
      </div>

      {/* Vault Card */}
      <section className={`puzzle-vault-card ${isInsaneSpinning ? "vault-locked-active" : ""}`}>
        <header className="vault-header">
          <span className="micro-label">THEOREM OF KEMET &middot; OM NANDURKAR&apos;S CURATOR LOCK</span>
          <h1>
            {mode === "ring" ? <>Rotate the <em>Celestial Rings</em></> :
             mode === "constellation" ? <>Connect the <em>Giza Stars</em></> :
             <>Align the <em>Sacred Relics</em></>}
          </h1>
          <p className="vault-instruction">
            {mode === "ring" ? "Rotate outer, middle, and inner rings to align with 12 o'clock axis to trigger Om's sanctum beam." :
             mode === "constellation" ? "Trace the 4 stars of Orion's Belt and Sphinx alignment on the sky matrix." :
             "Select the 4 hieroglyphic tablets in keeper's order to unseal Om's personal edit room."}
          </p>
        </header>

        {/* ── MODE 1: Rotational Celestial Ring Vault ── */}
        {mode === "ring" && (
          <div className="ring-dial-container">
            <div className={`ring-dial-stage ${isInsaneSpinning ? "stage-insane-mode" : ""}`}>
              <div className="alignment-pointer">▼</div>
              <div className="alignment-laser" />

              {/* Cosmic Light Beam Core Layer */}
              {lightBeamActive && <div className="cosmic-light-beam" />}

              {/* Outer Ring */}
              <div className={`dial-ring outer ${isInsaneSpinning ? "spin-outer-insane" : ""}`} style={{ transform: `rotate(${outerAngle}deg)` }}>
                <div className="ring-node pos-top"><i>✦</i>Orion</div>
                <div className="ring-node pos-right"><i>☾</i>Sirius</div>
                <div className="ring-node pos-bottom"><i>☉</i>Thuban</div>
                <div className="ring-node pos-left"><i>⟡</i>Canopus</div>
              </div>

              {/* Middle Ring */}
              <div className={`dial-ring middle ${isInsaneSpinning ? "spin-middle-insane" : ""}`} style={{ transform: `rotate(${middleAngle}deg)` }}>
                <div className="ring-node pos-top"><i>𓊽</i>Djed</div>
                <div className="ring-node pos-right"><i>𓂀</i>Eye</div>
                <div className="ring-node pos-bottom"><i>𓆣</i>Scarab</div>
                <div className="ring-node pos-left"><i>𓋹</i>Ankh</div>
              </div>

              {/* Inner Ring */}
              <div className={`dial-ring inner ${isInsaneSpinning ? "spin-inner-insane" : ""}`} style={{ transform: `rotate(${innerAngle}deg)` }}>
                <div className="ring-node pos-top">Lapis</div>
                <div className="ring-node pos-right">Gold</div>
                <div className="ring-node pos-bottom">Stone</div>
                <div className="ring-node pos-left">Ink</div>
              </div>

              <div className={`dial-center-core ${isInsaneSpinning ? "core-insane-pulse" : ""}`}>
                <span>OM</span>
              </div>
            </div>

            <div className="ring-controls-row">
              <button type="button" className="ring-rotate-btn" disabled={unsealing} onClick={() => setOuterAngle((a) => a + 90)}>
                <Orbit size={13} /> Rotate Outer ({((outerAngle % 360 + 360) % 360)}°)
              </button>
              <button type="button" className="ring-rotate-btn" disabled={unsealing} onClick={() => setMiddleAngle((a) => a + 90)}>
                <Orbit size={13} /> Rotate Middle ({((middleAngle % 360 + 360) % 360)}°)
              </button>
              <button type="button" className="ring-rotate-btn" disabled={unsealing} onClick={() => setInnerAngle((a) => a + 90)}>
                <Orbit size={13} /> Rotate Inner ({((innerAngle % 360 + 360) % 360)}°)
              </button>
              <button type="button" className="ring-rotate-btn auto-solve-btn" disabled={unsealing} onClick={triggerInsaneUnlock}>
                <Zap size={13} /> Insane Spin &amp; Unseal
              </button>
            </div>
          </div>
        )}

        {/* ── MODE 2: Orion Constellation Matrix ── */}
        {mode === "constellation" && (
          <div className="constellation-stage">
            <div className="constellation-svg-wrap">
              <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                {starPath.map((starId, i) => {
                  if (i === 0) return null;
                  const prev = ORION_STARS.find((s) => s.id === starPath[i - 1]);
                  const curr = ORION_STARS.find((s) => s.id === starId);
                  if (!prev || !curr) return null;
                  return (
                    <line
                      key={`${prev.id}-${curr.id}`}
                      x1={prev.x}
                      y1={prev.y}
                      x2={curr.x}
                      y2={curr.y}
                      stroke="#d4b574"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  );
                })}
              </svg>

              {ORION_STARS.map((star) => (
                <button
                  key={star.id}
                  type="button"
                  className={`star-node-btn ${starPath.includes(star.id) ? "selected" : ""}`}
                  style={{ left: `${star.x}px`, top: `${star.y}px` }}
                  onClick={() => handleStarClick(star.id)}
                >
                  <span className="star-dot" />
                  <span className="star-label">{star.name}</span>
                </button>
              ))}
            </div>

            <div className="constellation-progress-bar">
              <span>Sequence:</span>
              {targetStarOrder.map((_, i) => (
                <span key={i} className={`constellation-step-dot ${i < starPath.length ? "active" : ""}`} />
              ))}
            </div>
          </div>
        )}

        {/* ── MODE 3: Relic Sequence Tablet ── */}
        {mode === "relic" && (
          <div className="relic-sequence-wrap">
            <div className="relic-slots-bar">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`relic-slot ${relicSeq[i] ? "filled" : ""}`}>
                  {relicSeq[i] ? CURATOR_RELICS.find((r) => r.id === relicSeq[i])?.glyph : "·"}
                </div>
              ))}
            </div>

            <div className="relic-grid-v2">
              {CURATOR_RELICS.slice(0, 6).map((relic) => (
                <button
                  key={relic.id}
                  type="button"
                  className="relic-tile-btn"
                  disabled={relicSeq.includes(relic.id as CuratorRelicId) || unsealing}
                  onClick={() => handleRelicSelect(relic.id as CuratorRelicId)}
                >
                  <i>{relic.glyph}</i>
                  <span>{relic.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Notice */}
        {notice && <p className="vault-error-notice">{notice}</p>}

        {/* Footer controls */}
        <footer className="vault-footer">
          <button
            type="button"
            className="vault-reset-btn"
            disabled={unsealing}
            onClick={() => {
              setOuterAngle(180);
              setMiddleAngle(270);
              setInnerAngle(0);
              setStarPath([]);
              setRelicSeq([]);
              setNotice("");
            }}
          >
            <RotateCcw size={13} /> Reset mechanism
          </button>

          <button type="button" className="vault-shortcut-btn" onClick={() => setShowOverride(true)}>
            <Command size={13} /> Password override (⌘/Ctrl + K)
          </button>
        </footer>
      </section>

      {/* Password Override Modal */}
      {showOverride && (
        <div className="puzzle-override" role="dialog">
          <form onSubmit={handlePasswordUnlock}>
            <button type="button" className="puzzle-dismiss" onClick={() => setShowOverride(false)}>
              &times;
            </button>
            <LockKeyhole size={24} />
            <span className="micro-label">CURATOR OVERRIDE</span>
            <h2>Use spoken key</h2>
            <p>Enter Om Nandurkar&apos;s private curator password to unseal the edit room immediately.</p>
            <label>
              Password
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: Pass@123)"
              />
            </label>
            <button type="submit" className="ink-button" disabled={!password}>
              <KeyRound size={15} /> Unseal Om&apos;s Edit Room
            </button>
          </form>
        </div>
      )}

      {/* Unseal Celebration Banner & Blinding Light Beam Transition */}
      {unsealing && (
        <div className={`unsealed-banner ${lightBeamActive ? "beam-screen-wash" : ""}`}>
          <div className="unsealed-content">
            <Sparkles size={54} className="sparkle-pulse-icon" />
            <span className="micro-label">KEEPER &middot; OM NANDURKAR</span>
            <h2>SANCTUM BEAM UNLOCKED</h2>
            <p className="unseal-sub">Opening Om Nandurkar&apos;s Personal Edit Room...</p>
          </div>
        </div>
      )}
    </main>
  );
}

