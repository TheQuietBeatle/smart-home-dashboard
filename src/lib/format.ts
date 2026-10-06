export function num(n: number, digits = 1): string {
  return n.toFixed(digits).replace('.', ',')
}
