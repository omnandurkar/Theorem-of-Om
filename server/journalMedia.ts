/** Convert a publicly shared Google Drive file URL into a browser-renderable image URL. */
export function normalizeDriveImageUrl(input?: string | null) {
  const url = input?.trim();
  if (!url) return null;
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (fileMatch?.[1]) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w2000`;
  const idMatch = url.match(/[?&]id=([^&#]+)/i);
  if (idMatch?.[1] && /drive\.google\.com/i.test(url)) return `https://lh3.googleusercontent.com/d/${idMatch[1]}=w2000`;
  return url;
}
