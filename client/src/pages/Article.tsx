/**
 * Style reminder — Field Notes of the Necropolis: the article is the physical scroll of the experience.
 * Let words arrive with purpose, pair them with sparse marginal evidence, and protect a calm long-read rhythm.
 */
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Bookmark, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useParams } from "wouter";
import { articles } from "@/data/articles";
import { getLocalRecord } from "@/lib/localArchive";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";
import { ReaderControls } from "@/components/ReaderControls";
import { parseSavedRecords, SAVED_RECORDS_KEY, toggleSavedRecord } from "@/lib/readerSavedRecords";

function RevealText({ children, delay = 0 }: { children: string; delay?: number }) { const ref = useRef<HTMLParagraphElement>(null); const inView = useInView(ref, { once: true, margin: "-12%" }); const words = children.split(" "); return <p ref={ref} className="article-paragraph">{words.map((word, index) => <motion.span key={`${word}-${index}`} initial={{ opacity: 0.2, y: 4 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.34, delay: delay + index * 0.018 }}>{word}{"\u00A0"}</motion.span>)}</p>; }

function EvidenceFragment({ chapter }: { chapter: number }) { const image = chapter % 2 === 0 ? "/assets/kemet-evidence.jpg" : "/assets/kemet-scroll.jpg"; return <aside className={`article-evidence article-evidence-${chapter}`}><div className="evidence-pin" /><img src={image} alt="A related archival fragment" /><div><span className="micro-label">MARGIN / {String(chapter + 1).padStart(2, "0")}</span><strong>{chapter === 0 ? "Object trail" : "Context slip"}</strong><p>{chapter === 0 ? "The visible mark is not the whole record." : "Set the claim beside the material world."}</p></div></aside>; }

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const localRecord = slug ? getLocalRecord(slug) : undefined;
  const fallback = articles.find((record) => record.slug === slug) || articles[0];
  const article = localRecord ? { ...localRecord, image: localRecord.image || "/assets/om-specimen-field-station.webp", tone: localRecord.presentation.palette === "ink" ? "night" as const : "paper" as const, sections: [{ label: "I. OM’S FIELD TEXT", heading: localRecord.title, paragraphs: localRecord.body.split(/\n{2,}/).filter(Boolean) }] } : fallback;
  const nextArticle = articles[(articles.findIndex((record) => record.slug === fallback.slug) + 1) % articles.length];
  const previewStyle = localRecord ? { "--record-font": localRecord.presentation.fontFamily, "--record-wash": localRecord.presentation.paletteHex } as CSSProperties : undefined;
  const [savedRecords, setSavedRecords] = useState<string[]>(() => typeof window === "undefined" ? [] : parseSavedRecords(window.localStorage.getItem(SAVED_RECORDS_KEY)));
  const isSaved = savedRecords.includes(article.slug);
  useEffect(() => { setSavedRecords(typeof window === "undefined" ? [] : parseSavedRecords(window.localStorage.getItem(SAVED_RECORDS_KEY))); }, [article.slug]);
  const toggleSaved = () => setSavedRecords((current) => { const next = toggleSavedRecord(current, article.slug); window.localStorage.setItem(SAVED_RECORDS_KEY, JSON.stringify(next)); return next; });

  return <main className={`article-page article-${article.tone} ${localRecord ? "article-local-record" : ""}`} style={previewStyle}><ReadingRail current={article.category.toUpperCase()} />
    <section className="article-hero"><Link href="/archive" className="article-back"><ArrowLeft size={16} /> All records</Link><div className="article-hero-image"><img src={article.image} alt="" /><div /></div>{localRecord && <><div className={`article-vector-trace vector-${localRecord.presentation.vector}`} /><div className={`article-hero-motif motif-${localRecord.presentation.motif}`}><img src="/assets/om-field-station-stickers.webp" alt="" /></div></>}<div className="article-hero-copy"><p className="eyebrow-light">{article.eyebrow}</p><h1>{article.title}</h1><p>{article.excerpt}</p><div className="article-meta"><span>{article.date}</span><span>{article.readTime}</span><span>{localRecord ? "LOCAL DRAFT / OMN" : "FIELD RECORD / OMN"}</span></div></div></section>
    <section className="article-layout"><aside className="article-margin-note"><span className="micro-label">THE GUIDING QUESTION</span><p>{article.keyQuestion}</p><i>Draw your own line through the evidence.</i></aside><article className="article-reading-column"><div className="article-toolbar"><ReaderControls /><div className="article-utility-actions"><button className={isSaved ? "is-saved" : ""} aria-label={isSaved ? "Remove saved record" : "Save record"} aria-pressed={isSaved} onClick={toggleSaved}><Bookmark size={17} /> <span>{isSaved ? "Saved" : "Save"}</span></button><button aria-label="Share record"><Share2 size={17} /></button></div></div><p className="article-save-status" aria-live="polite">{isSaved ? "Saved on this device." : ""}</p><div className="article-intro-mark">{localRecord?.presentation.symbol || "𓂀"}</div>{localRecord && <aside className="article-author-sticky"><span>{localRecord.presentation.stickyTitle}</span><strong>{localRecord.presentation.stickyBody}</strong><i>OM’S LOCAL ANNOTATION</i></aside>}{article.sections.map((section, sectionIndex) => <section key={section.heading} className="article-chapter"><span className="chapter-label">{section.label}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, paragraphIndex) => <RevealText key={paragraph} delay={sectionIndex * 0.05 + paragraphIndex * 0.02}>{paragraph}</RevealText>)}{section.pullQuote && <blockquote className="article-pullquote">{section.pullQuote}</blockquote>}{sectionIndex < article.sections.length - 1 && <EvidenceFragment chapter={sectionIndex} />}</section>)}<div className="article-closure"><span className="micro-label">END OF RECORD</span><p>This entry was arranged for curious readers, not for certainty. Revisit the archive when the question changes shape.</p></div></article></section>
    <section className="next-record-section"><span className="micro-label">CONTINUE THE INQUIRY</span><Link href={`/article/${nextArticle.slug}`}><span>Next record</span><strong>{nextArticle.title}</strong><ArrowUpRight size={24} /></Link></section><PageFooter />
  </main>;
}
