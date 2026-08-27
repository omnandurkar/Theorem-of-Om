/** Style reminder — Field Notes of the Necropolis: even a missing page should feel like an unfiled fragment, not a generic error. */
import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="archive-page" style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "110px 24px" }}>
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <p className="micro-label">UNFILED FRAGMENT · 404</p>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "clamp(58px, 9vw, 110px)", lineHeight: .8, letterSpacing: "-.06em", margin: "18px 0" }}>This record<br /><em>has moved.</em></h1>
        <p style={{ color: "#63706b", lineHeight: 1.8 }}>The shelf is empty here. Return to the reading room and begin with an open case.</p>
        <Link href="/archive" className="ink-button" style={{ marginTop: 25 }}>Return to the archive</Link>
      </div>
    </main>
  );
}
