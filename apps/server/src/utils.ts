/** biome-ignore-all lint/style/noMagicNumbers: its base 62 */
export function toBase62(number: number) {
  const base62 =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  let num = number;
  while (num > 0) {
    result = base62[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}
