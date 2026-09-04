/**
 * Style reminder — Field Notes of the Necropolis: the chrome should behave like a quiet museum label
 * and a physical reading rail. Use dark ink, thin rules, one strong cartouche mark, and restrained motion.
 */
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Globe, Menu, MousePointer2, Search, X } from "lucide-react";
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
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cursorPref, setCursorPref] = useState<boolean>(() => readCustomCursorPreference());

  const toggleCursor = () => {
    const next = !cursorPref;
    setCursorPref(next);
    writeCustomCursorPreference(next);
  };

  return (
    <header className="site-header">
      <Link href="/" className="brand-lockup">
        <img src="/assets/kemet-mark.webp" alt="Theorem of Kemet emblem" className="brand-mark" />
        <span className="brand-type">
          <strong>Theorem of Kemet</strong>
          <small>FIELD NOTES · OMN</small>
        </span>
      </Link>

      <nav className="desktop-nav">
        {NAV.map(([label, href]) => {
          const isActive = location === href || location.startsWith(href);
          return (
            <Link key={href} href={href} className={`nav-link ${isActive ? "active" : ""}`}>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="cursor-preference-control"
          aria-pressed={cursorPref}
          onClick={toggleCursor}
          title="Toggle custom field cursor"
        >
          <MousePointer2 size={13} />
          <span>{cursorPref ? "Field Cursor ON" : "Cursor Normal"}</span>
        </button>
        <Link href="/archive" className="glyph-button" aria-label="Search archive">
          <Search size={16} />
        </Link>

        <button
          type="button"
          className="menu-trigger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          <span>Index</span>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {NAV.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function ReadingRail({ current }: { current: string }) {
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
        <div className="footer-external-links">
          <a href="https://www.omnandurkar.space" target="_blank" rel="noopener noreferrer" className="footer-ext-link" title="Om's Personal Portfolio">
            <Globe size={13} />
            <span>www.omnandurkar.space</span>
            <ArrowUpRight size={12} />
          </a>
          <span className="footer-link-divider">·</span>
          <a href="https://archive.omnandurkar.space" target="_blank" rel="noopener noreferrer" className="footer-ext-link" title="Creator Studios Archive">
            <ExternalLink size={13} />
            <span>Creator Studios · archive.omnandurkar.space</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
      <div className="footer-policy">
        <div>Reader-first archive · No claims without a question.</div>
        <div className="footer-creator-credits">
          <a href="https://www.omnandurkar.space" target="_blank" rel="noopener noreferrer">Portfolio</a>
          {" · "}
          <a href="https://archive.omnandurkar.space" target="_blank" rel="noopener noreferrer">Creator Studios</a>
        </div>
      </div>
    </footer>
  );
}
