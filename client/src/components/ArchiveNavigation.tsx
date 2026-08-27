import { ChevronLeft, ChevronRight, Home, Slash } from "lucide-react";
import { Link } from "wouter";

export type ArchiveCrumb = { label: string; href?: string };

export function buildPageWindow(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const middle = [Math.max(2, page - 1), page, Math.min(totalPages - 1, page + 1)].filter((value, index, values) => values.indexOf(value) === index);
  return [1, ...(middle[0] > 2 ? ["ellipsis" as const] : []), ...middle, ...(middle[middle.length - 1] < totalPages - 1 ? ["ellipsis" as const] : []), totalPages];
}

export function ArchiveBreadcrumb({ items }: { items: ArchiveCrumb[] }) {
  return <nav className="archive-breadcrumb" aria-label="Breadcrumb"><Link href="/" aria-label="Theorem of Kemet home"><Home size={12} /></Link>{items.map((item, index) => <span key={`${item.label}-${index}`}><Slash size={11} />{item.href ? <Link href={item.href}>{item.label}</Link> : <strong aria-current="page">{item.label}</strong>}</span>)}</nav>;
}

export function ArchivePagination({ page, totalPages, total, onPageChange }: { page: number; totalPages: number; total: number; onPageChange: (nextPage: number) => void }) {
  if (totalPages <= 1) return null;
  return <nav className="archive-pagination" aria-label="Journal pages"><p><span>FILE WINDOW</span> {total} public records</p><div><button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={16} /></button>{buildPageWindow(page, totalPages).map((item, index) => item === "ellipsis" ? <i key={`ellipsis-${index}`}>…</i> : <button type="button" key={item} aria-label={`Page ${item}`} aria-current={item === page ? "page" : undefined} className={item === page ? "active" : ""} onClick={() => onPageChange(item)}>{String(item).padStart(2, "0")}</button>)}<button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}><ChevronRight size={16} /></button></div></nav>;
}
