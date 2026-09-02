import { SearchResult } from './BinarySearch';

/**
 * Sequential Linear Search
 * Iterative scan used as comparative reference.
 *
 * Complexity:
 * - Best Case: O(1)
 * - Average / Worst Case: O(n)
 * - Space: O(1)
 */
export class LinearSearch {
  public static search<T>(
    arr: T[],
    target: T,
    comparator: (a: T, b: T) => number
  ): SearchResult<T> {
    const start = performance.now();
    let comparisons = 0;
    const trace: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      comparisons++;
      if (comparisons <= 5 || i === arr.length - 1) {
        trace.push(`[LinearSearch] Scanned index ${i} (${arr[i]})`);
      }
      if (comparator(arr[i], target) === 0) {
        const timeMs = performance.now() - start;
        trace.push(`[LinearSearch] Target matched at index ${i} after ${comparisons} evaluations`);
        return { foundIndex: i, value: arr[i], comparisons, timeMs, trace };
      }
    }

    const timeMs = performance.now() - start;
    return { foundIndex: -1, value: null, comparisons, timeMs, trace };
  }
}
