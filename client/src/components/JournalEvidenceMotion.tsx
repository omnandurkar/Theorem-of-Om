import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EVIDENCE_STEPS = [
  ["01", "OBSERVE", "Start with the material trace."],
  ["02", "COMPARE", "Keep a second explanation nearby."],
  ["03", "CITE", "Leave the reader a visible path back."],
] as const;

export function JournalEvidenceMotion() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 800px)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".motion-evidence-card");
      const note = root.current?.querySelector<HTMLElement>(".motion-margin-note");
      const loupe = root.current?.querySelector<HTMLElement>(".motion-loupe");
      const path = root.current?.querySelector<SVGPathElement>(".motion-trace-path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      }
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 72%", end: "bottom 22%", scrub: 0.7 },
      });
      timeline.fromTo(cards, { y: 55, opacity: 0, rotate: (index) => index === 1 ? -4 : 4 }, { y: 0, opacity: 1, rotate: 0, stagger: 0.32, ease: "power2.out", duration: 0.9 }, 0);
      if (path) timeline.to(path, { strokeDashoffset: 0, ease: "none", duration: 1.25 }, 0.2);
      if (loupe) timeline.fromTo(loupe, { xPercent: -130, opacity: 0 }, { xPercent: 30, opacity: 1, ease: "none", duration: 1.4 }, 0.35);
      if (note) timeline.fromTo(note, { y: 32, rotate: 7, opacity: 0 }, { y: 0, rotate: -3, opacity: 1, ease: "power2.out", duration: 0.7 }, 1.08);
    }, root);
    return () => ctx.revert();
  }, []);

  return <section ref={root} className="journal-motion-table" aria-label="Om’s three-step reading method"><div className="motion-table-grid" /><header><span className="micro-label">FIELD METHOD / SCROLL TO TRACE</span><h2>The evidence table<br /><em>comes alive.</em></h2><p>A small motion study of Om’s reading method. The effect pauses when motion reduction is requested.</p></header><div className="motion-evidence-row">{EVIDENCE_STEPS.map(([index, label, copy]) => <article className="motion-evidence-card" key={index}><span>{index}</span><strong>{label}</strong><p>{copy}</p><i>OMN / METHOD</i></article>)}</div><svg className="motion-trace" viewBox="0 0 1200 320" aria-hidden="true"><path className="motion-trace-path" d="M 65 255 C 225 120, 336 270, 478 150 S 735 86, 850 204 S 1038 170, 1150 64" /></svg><div className="motion-loupe" aria-hidden="true"><span /><i /></div><aside className="motion-margin-note"><span>BLUE INK NOTE</span><strong>The path<br />is not proof.</strong><i>FOLLOW IT<br />ANYWAY.</i></aside></section>;
}
