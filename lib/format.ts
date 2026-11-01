const nf = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

export const fmt = (n: number) => nf.format(Math.round(n));
export const fmt1 = (n: number) => nf1.format(n);
export const tenge = (n: number) => `${fmt(n)} ₸`;

/** 29 871 350 → "29,9 млн ₸" */
export function tengeShort(n: number) {
  const a = Math.abs(n);
  if (a >= 1e9) return `${fmt1(n / 1e9)} млрд ₸`;
  if (a >= 1e6) return `${fmt1(n / 1e6)} млн ₸`;
  return tenge(n);
}

export function plural(n: number, one: string, few: string, many: string) {
  // Fractions shown with one decimal ("5,6 года") take the genitive singular
  if (Math.round(n * 10) % 10 !== 0) return few;
  const a = Math.abs(Math.round(n)) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}
