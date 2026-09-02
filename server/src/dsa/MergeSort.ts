/**
 * Divide-and-Conquer Merge Sort
 * Stable full-array sorting algorithm.
 *
 * Complexity:
 * - Time (All Cases): O(n log n)
 * - Auxiliary Space: O(n)
 */
export class MergeSort {
  private static comparisonsCount: number = 0;
  private static allocationsCount: number = 0;

  public static sort<T>(
    arr: T[],
    comparator: (a: T, b: T) => number
  ): { sorted: T[]; comparisons: number; timeMs: number } {
    this.comparisonsCount = 0;
    this.allocationsCount = 0;
    const start = performance.now();

    const result = this.mergeSortRecursive([...arr], comparator);
    const timeMs = performance.now() - start;

    return {
      sorted: result,
      comparisons: this.comparisonsCount,
      timeMs
    };
  }

  private static mergeSortRecursive<T>(
    arr: T[],
    comparator: (a: T, b: T) => number
  ): T[] {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSortRecursive(arr.slice(0, mid), comparator);
    const right = this.mergeSortRecursive(arr.slice(mid), comparator);

    return this.merge(left, right, comparator);
  }

  private static merge<T>(
    left: T[],
    right: T[],
    comparator: (a: T, b: T) => number
  ): T[] {
    const merged: T[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      this.comparisonsCount++;
      if (comparator(left[i], right[j]) <= 0) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }
    }

    while (i < left.length) {
      merged.push(left[i]);
      i++;
    }

    while (j < right.length) {
      merged.push(right[j]);
      j++;
    }

    this.allocationsCount += merged.length;
    return merged;
  }
}
