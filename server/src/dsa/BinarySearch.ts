/**
 * Binary Search & Bounded Range Resolution
 * Provides O(log n) lookup over sorted arrays and delivery schedules.
 *
 * Complexity:
 * - Best Case: O(1)
 * - Average / Worst Case: O(log n)
 * - Space: O(1)
 */
export interface SearchResult<T> {
  foundIndex: number;
  value: T | null;
  comparisons: number;
  timeMs: number;
  trace: string[];
}

export class BinarySearch {
  /**
   * Classic binary search on sorted array
   */
  public static search<T>(
    arr: T[],
    target: T,
    comparator: (a: T, b: T) => number
  ): SearchResult<T> {
    const start = performance.now();
    let low = 0;
    let high = arr.length - 1;
    let comparisons = 0;
    const trace: string[] = [];

    while (low <= high) {
      comparisons++;
      const mid = low + Math.floor((high - low) / 2);
      const cmp = comparator(arr[mid], target);

      trace.push(`[BinarySearch] Evaluated index ${mid} (${arr[mid]}), window=[${low}, ${high}]`);

      if (cmp === 0) {
        const timeMs = performance.now() - start;
        return { foundIndex: mid, value: arr[mid], comparisons, timeMs, trace };
      } else if (cmp < 0) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const timeMs = performance.now() - start;
    return { foundIndex: -1, value: null, comparisons, timeMs, trace };
  }

  /**
   * Find earliest feasible delivery slot where slot >= availableAt and slot <= deadlineMinutes
   * Implements lower-bound binary search in O(log m)
   */
  public static findEarliestFeasibleSlot(
    slots: number[],
    availableAtMinutes: number,
    deadlineMinutes: number
  ): { slot: number | null; index: number; comparisons: number; trace: string[] } {
    let low = 0;
    let high = slots.length - 1;
    let ansIndex = -1;
    let comparisons = 0;
    const trace: string[] = [];

    while (low <= high) {
      comparisons++;
      const mid = low + Math.floor((high - low) / 2);
      const currentSlot = slots[mid];

      trace.push(`[SlotSearch] Inspected slot #${mid} = ${currentSlot}m (Available: ${availableAtMinutes}m, Deadline: ${deadlineMinutes}m)`);

      if (currentSlot >= availableAtMinutes && currentSlot <= deadlineMinutes) {
        ansIndex = mid;
        // Search left for earlier feasible slot
        high = mid - 1;
      } else if (currentSlot < availableAtMinutes) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return {
      slot: ansIndex !== -1 ? slots[ansIndex] : null,
      index: ansIndex,
      comparisons,
      trace
    };
  }
}
