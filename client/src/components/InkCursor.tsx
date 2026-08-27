import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { CURSOR_PREFERENCE_EVENT, readCustomCursorPreference } from "@/lib/cursorPreference";

type FieldSignal = "cartouche" | "dust" | "star-map" | null;

export function InkCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const lensX = useSpring(x, { stiffness: 520, damping: 34, mass: 0.22 });
  const lensY = useSpring(y, { stiffness: 520, damping: 34, mass: 0.22 });
  const [pressed, setPressed] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [signal, setSignal] = useState<FieldSignal>(null);
  const [enabled, setEnabled] = useState(readCustomCursorPreference);

  useEffect(() => {
    const syncPreference = (event?: Event) => setEnabled(event instanceof CustomEvent ? Boolean(event.detail) : readCustomCursorPreference());
    window.addEventListener(CURSOR_PREFERENCE_EVENT, syncPreference);
    window.addEventListener("storage", syncPreference);
    return () => { window.removeEventListener(CURSOR_PREFERENCE_EVENT, syncPreference); window.removeEventListener("storage", syncPreference); };
  }, []);

  useEffect(() => {
    if (!enabled || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.body.classList.add("field-cursor-on");
    let typed = "";
    const konami = ["ARROWUP", "ARROWUP", "ARROWDOWN", "ARROWDOWN", "ARROWLEFT", "ARROWRIGHT", "ARROWLEFT", "ARROWRIGHT"];
    const keys: string[] = [];
    const move = (event: MouseEvent) => { x.set(event.clientX); y.set(event.clientY); setInteractive(Boolean((event.target as Element | null)?.closest("a, button, input, textarea, select, [role='button']"))); };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const key = (event: KeyboardEvent) => {
      if (event.key.length === 1) { typed = `${typed}${event.key.toUpperCase()}`.slice(-5); if (typed === "KEMET") { setSignal("cartouche"); typed = ""; } if (typed.slice(-4) === "SAND") { setSignal("dust"); typed = ""; } }
      keys.push(event.key.toUpperCase()); if (keys.length > konami.length) keys.shift(); if (keys.join("|") === konami.join("|")) setSignal("star-map");
    };
    window.addEventListener("mousemove", move); window.addEventListener("mousedown", down); window.addEventListener("mouseup", up); window.addEventListener("keydown", key);
    return () => { document.body.classList.remove("field-cursor-on"); window.removeEventListener("mousemove", move); window.removeEventListener("mousedown", down); window.removeEventListener("mouseup", up); window.removeEventListener("keydown", key); };
  }, [enabled, x, y]);

  const copy = signal === "dust" ? { mark: "𓂋", title: "THE TABLE IS DUSTED", text: "A grain of sand is not proof. It is an invitation to look more closely." } : signal === "star-map" ? { mark: "✦", title: "THE STAR MAP FOLDS OPEN", text: "Some alignments are maps. Others are the way a question learns to shine." } : { mark: "𓋹", title: "THE CARTOUCHE OPENS", text: "Every archive begins with a mark someone chose not to erase." };
  if (!enabled) return null;
  return <>{<motion.div aria-hidden="true" className={`field-cursor ${pressed ? "pressed" : ""} ${interactive ? "interactive" : ""}`} style={{ x: lensX, y: lensY }}><span className="field-cursor-ring" /><span className="field-cursor-cross" /><i>{interactive ? "OPEN" : "TRACE"}</i></motion.div>}{signal && <button className="cartouche-easter-egg" onClick={() => setSignal(null)}><span>{copy.mark}</span><strong>{copy.title}</strong><p>{copy.text}</p><small>PRESS / CLOSE</small></button>}</>;
}
