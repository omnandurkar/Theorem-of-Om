export function normalizeDriveImageUrl(input: string) {
  const url = input.trim();
  const match = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i) || url.match(/[?&]id=([^&#]+)/i);
  return match && /drive\.google\.com/i.test(url) ? `https://lh3.googleusercontent.com/d/${match[1]}=w2000` : url;
}
