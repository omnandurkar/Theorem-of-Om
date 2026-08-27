export function cycleFolioIndex(currentIndex: number, change: number, total: number) {
  if (!Number.isInteger(total) || total <= 0) return 0;
  return ((currentIndex + change) % total + total) % total;
}

export function folioNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}
