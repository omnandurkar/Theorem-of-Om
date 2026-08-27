/**
 * Style reminder — Field Notes of the Necropolis: archive cards are uneven folios pinned to an evidence table.
 * They should feel categorised but human, with clipped corners, dossier labels, and airy museum-like spacing.
 */
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { categories, articles } from "@/data/articles";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";

export default function Archive() {
  const [activeCategory, setActiveCategory] = useState("All records");
  const [query, setQuery] = useState("");
  const [location] = useLocation();
  useEffect(() => {
    if (!new URLSearchParams(location.split("?")[1] || "").has("focus")) return;
    const timer = window.setTimeout(() => document.getElementById("archive-search")?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [location]);
  const filtered = useMemo(() => articles.filter((article) => {
    const categoryMatches = activeCategory === "All records" || article.category === activeCategory;
    const queryMatches = `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatches && queryMatches;
  }), [activeCategory, query]);

  return (
    <main className="archive-page">
      <ReadingRail current="INDEX / ALL RECORDS" />
      <section className="archive-head">
        <div className="archive-head-copy">
          <span className="micro-label">THEOREM OF KEMET · 03 OPEN CASES</span>
          <h1>The archive<br />of <em>unquiet</em><br />history.</h1>
          <p>A considered library of essays about ancient Egypt, its canonical record, and the questions that linger at its margins.</p>
        </div>
        <div className="archive-stamp"><span>OPEN FOR</span><strong>INQUIRY</strong><small>OMN / 2026</small></div>
      </section>

      <section className="archive-controls" aria-label="Archive filters">
        <div className="search-field"><Search size={17} /><input id="archive-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by object, place, idea..." /></div>
        <div className="category-tabs"><SlidersHorizontal size={16} />{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={activeCategory === category ? "active" : ""}>{category}</button>)}</div>
      </section>

      <section className="archive-grid-section">
        <div className="archive-grid-label"><span>SHOWING {String(filtered.length).padStart(2, "0")} RECORDS</span><span>ALL MATERIALS ARE ESSAYS, NOT FINAL VERDICTS.</span></div>
        <AnimatePresence mode="popLayout">
          <div className="archive-grid">
            {filtered.map((article, index) => (
              <motion.article key={article.slug} className={`archive-card archive-card-${index % 3}`} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <Link href={`/article/${article.slug}`} className="archive-card-link">
                  <span className="card-catalogue">CAT. {String(index + 1).padStart(2, "0")} / OMN</span>
                  <div className="archive-image"><img src={article.image} alt="" /><span>{article.category}</span></div>
                  <div className="archive-card-body">
                    <p className="micro-label">{article.eyebrow}</p>
                    <h2>{article.title}</h2>
                    <p>{article.excerpt}</p>
                    <div className="archive-card-bottom"><span>{article.readTime}</span><ArrowUpRight size={17} /></div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </AnimatePresence>
        {!filtered.length && <div className="empty-record"><span className="micro-label">NO MATCHING DOSSIER</span><p>Try another object, place, or question.</p><button type="button" onClick={() => { setQuery(""); setActiveCategory("All records"); }}>Clear archive search</button></div>}
      </section>
      <PageFooter />
    </main>
  );
}
