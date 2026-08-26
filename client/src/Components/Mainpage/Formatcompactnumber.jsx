// Formats large raw numbers into compact, readable strings.
// e.g. 331839000000 -> "331.8B", 4820000 -> "4.8M", 950 -> "950"
export function formatCompactNumber(value) {
  if (typeof value !== "number" || isNaN(value)) return value;

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_000_000_000_000) return `${sign}${(abs / 1_000_000_000_000).toFixed(1)}T`;
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs}`;
}

// Same as above but prefixed with $, for currency values
export function formatCompactCurrency(value) {
  if (typeof value !== "number" || isNaN(value)) return value;
  return `$${formatCompactNumber(value)}`;
}