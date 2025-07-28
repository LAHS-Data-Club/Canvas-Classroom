export function simulateDelay(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}