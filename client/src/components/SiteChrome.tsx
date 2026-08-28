/**
 * Style reminder — Field Notes of the Necropolis: the chrome should behave like a quiet museum label
 * and a physical reading rail. Use dark ink, thin rules, one strong cartouche mark, and restrained motion.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MousePointer2, Search, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { readCustomCursorPreference, writeCustomCursorPreference } from "@/lib/cursorPreference";

const NAV = [
  ["Journal", "/journal"],
  ["Case index", "/index"],
  ["The archive", "/archive"],
  ["Signals", "/investigations"],
  ["Field guide", "/about"],
  ["Submit theory", "/submit-theory"],
  ["Om's desk", "/om-dashboard"],
] as const;

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const currentPath = location.split("?")[0];
  const focusArchiveSearch = () => {
    if (currentPath === "/archive") {
      document.getElementById("archive-search")?.focus();
      return;
    }
    setLocation("/archive?focus=search");
  };

  return (
    <header className="site-header">
      <Link href="/" className="brand-lockup" aria-label="Theorem of Kemet home">
        <img src="/assets/kemet-mark.webp" alt="" className="brand-mark" />
        <span className="brand-type">
          <strong>THEOREM</strong>
          <small>OF KEMET</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {NAV.map(([label, href]) => (
          <Link key={href} href={href} className={currentPath === href ? "nav-link active" : "nav-link"}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <CursorPreferenceControl />
        <button className="glyph-button" aria-label="Search the archive" onClick={focusArchiveSearch}>
          <Search size={17} strokeWidth={1.8} />
        </button>
        <button className="menu-trigger" aria-label="Open navigation" onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? <X size={20} /> : <Menu size={21} />}
          <span>Index</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV.map(([label, href], index) => (
              <motion.div key={href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * index }}>
                <Link href={href} onClick={() => setIsOpen(false)}>{label}</Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function CursorPreferenceControl() {
  const [enabled, setEnabled] = useState(readCustomCursorPreference);
  const toggle = () => { const next = !enabled; setEnabled(next); writeCustomCursorPreference(next); };
  return <button type="button" className="cursor-preference-control" aria-pressed={enabled} aria-label={`${enabled ? "Disable" : "Enable"} custom field cursor`} title={`${enabled ? "Disable" : "Enable"} custom field cursor`} onClick={toggle}><MousePointer2 size={15} strokeWidth={1.8} /><span>{enabled ? "Field cursor" : "System cursor"}</span></button>;
}

export function ReadingRail({ current = "ARCHIVE / 2026" }: { current?: string }) {
  return (
    <aside className="reading-rail" aria-hidden="true">
      <span className="rail-rule" />
      <span className="rail-copy">{current}</span>
      <span className="rail-stamp rail-stamp-one">OMN</span>
      <span className="rail-stamp rail-stamp-two">●</span>
      <span className="rail-progress"><i /><i /><i /><i /></span>
      <span className="rail-index">KMT—01</span>
    </aside>
  );
}

export function PageFooter() {
  return (
    <footer className="page-footer">
      <div className="footer-seal"><img src="/assets/kemet-mark.webp" alt="" /></div>
      <div>
        <p className="micro-label">THEOREM OF KEMET · EDITED IN THE PRESENT</p>
        <p className="footer-line">An independent history reading room by <strong>Om Nandurkar</strong>.</p>
      </div>
      <div className="footer-policy">Reader-first archive · No claims without a question.</div>
    </footer>
  );
}
