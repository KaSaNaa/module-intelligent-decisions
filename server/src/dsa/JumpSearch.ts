import { SearchResult } from './BinarySearch';

/**
 * Jump Search Algorithm
 * Block-jumping search over pre-sorted array indices.
 *
 * Complexity:
 * - Time: O(√n)
 * - Space: O(1)
 */
export class JumpSearch {
  public static search<T>(
    arr: T[],
    target: T,
    comparator: (a: T, b: T) => number
  ): SearchResult<T> {
    const start = performance.now();
    const n = arr.length;
    let comparisons = 0;
    const trace: string[] = [];

    if (n === 0) {
      return { foundIndex: -1, value: null, comparisons: 0, timeMs: performance.now() - start, trace };
    }

    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let curr = step;

    trace.push(`[JumpSearch] Block step √n = ${step}, size = ${n}`);

    // Identify target block
    while (curr < n && comparator(arr[Math.min(curr, n) - 1], target) < 0) {
      comparisons++;
      trace.push(`[JumpSearch] Advanced from index ${prev} to ${curr}`);
      prev = curr;
      curr += step;
    }

    if (curr < n) {
      comparisons++;
    }

    // Linear scan inside identified block
    trace.push(`[JumpSearch] Linear scan in block [${prev}, ${Math.min(curr, n) - 1}]`);
    while (prev < Math.min(curr, n)) {
      comparisons++;
      const cmp = comparator(arr[prev], target);
      if (cmp === 0) {
        const timeMs = performance.now() - start;
        trace.push(`[JumpSearch] Target located at index ${prev}`);
        return { foundIndex: prev, value: arr[prev], comparisons, timeMs, trace };
      }
      if (cmp > 0) {
        break;
      }
      prev++;
    }

    const timeMs = performance.now() - start;
    return { foundIndex: -1, value: null, comparisons, timeMs, trace };
  }
}
