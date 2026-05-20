export function greetingFor(now: Date): "Buenos días" | "Buenas tardes" | "Buenas noches" {
  const h = now.getHours();
  if (h < 6) return "Buenas noches";
  if (h < 13) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}
