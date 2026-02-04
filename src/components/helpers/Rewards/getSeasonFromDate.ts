export function getSeasonFromDate(
  date: Date,
): "winter" | "spring" | "summer" | "autumn" {
  const month = date.getMonth(); // 0 = Jan

  if (month === 11 || month === 0 || month === 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  return "autumn";
}
