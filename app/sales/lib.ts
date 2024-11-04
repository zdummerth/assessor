export function getMedian(values: number[]): number {
  if (values.length === 0) return 0;

  values.sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);

  return values.length % 2 !== 0
    ? values[mid]
    : (values[mid - 1] + values[mid]) / 2;
}

export function getMean(values: number[]): number {
  if (values.length === 0) return 0;

  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}
