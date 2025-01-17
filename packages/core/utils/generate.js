export function generateKey(length = 16) {
  return Math.random().toString(36).substr(2, length);
}
