import { CheckCircle2, Feather, Send } from "lucide-react";
import { useState } from "react";
import { ArchiveBreadcrumb } from "@/components/ArchiveNavigation";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";

export default function SubmitTheory() {
  const [readerName, setReaderName] = useState("");
  const [theory, setTheory] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const letters = JSON.parse(window.localStorage.getItem("kemet-reader-letters") || "[]");
    letters.push({ readerName, theory, submittedAt: new Date().toISOString() });
    window.localStorage.setItem("kemet-reader-letters", JSON.stringify(letters));
    setReaderName("");
    setTheory("");
    setSent(true);
  };

  return <main className="theory-letter-page"><ReadingRail current="READER LETTER / OPEN DESK" /><ArchiveBreadcrumb items={[{ label: "Submit a theory" }]} /><section className="theory-letter-hero"><div><span className="micro-label">OM’S SCRIBAL INBOX · PUBLIC LETTER</span><h1>Leave a question<br />on the <em>table.</em></h1><p>Suggest a theory, a source trail, an unexplained place, or the question you believe deserves a careful record. Om reads these as letters—not as proof.</p><div className="theory-letter-rule"><Feather size={16} /> Only your name and the theory. No account, mailing list, or public comment thread.</div></div><aside><span>OMN</span><small>FIELD POST<br />/ OPEN</small></aside></section><section className="theory-letter-sheet">{sent ? <div className="theory-letter-sent"><CheckCircle2 size={28} /><span className="micro-label">LETTER RECEIVED ON THIS DEVICE</span><h2>Your question is<br /><em>on your desk.</em></h2><p>This frontend-only version stores the draft letter in this browser’s local storage. Om can later copy it into the editable JSON content file.</p><button type="button" className="ink-button" onClick={() => setSent(false)}>Write another letter</button></div> : <form onSubmit={submit}><div className="theory-letter-form-head"><span className="micro-label">THEORY LETTER / 01</span><p>Write as if you are pinning a note to a field board: name the question and explain why it has stayed with you.</p></div><label>Your name<input value={readerName} onChange={(event) => setReaderName(event.target.value)} minLength={2} maxLength={120} required placeholder="How Om should address the letter" /></label><label>Your theory or topic<textarea value={theory} onChange={(event) => setTheory(event.target.value)} minLength={20} maxLength={3000} required rows={10} placeholder="What should Om investigate next? Include the detail, place, tradition, artifact, or question that makes it worth opening." /><small>{theory.length}/3000 · Minimum 20 characters</small></label><button className="ink-button" type="submit"><Send size={16} /> Save on this device</button></form>}</section><PageFooter /></main>;
}
