export function toAlphaVantageSymbol(symbol) {
  // Default assumption: Indian equities are on BSE
  return `${symbol}.BSE`;
}
