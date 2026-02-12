interface ComboStat {
  key: string;
  tokens: string[];
  count: number;
}

export function buildTopCombos(
  completions: { completion_tokens: string[] | null }[],
  limit = 5,
): ComboStat[] {
  const map = new Map<string, ComboStat>();

  for (const row of completions) {
    const tokens = row.completion_tokens;
    if (!tokens || tokens.length < 2) continue;

    const normalized = [...tokens].sort(); // order-insensitive
    const key = normalized.join("|");

    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, {
        key,
        tokens: normalized,
        count: 1,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
