/**
 * Generic Binary Heap Priority Queue (Min-Heap / Max-Heap)
 * High-performance array-backed heap for Top-K candidate selection.
 *
 * Complexity:
 * - Insert (offer): O(log k)
 * - Remove Root (poll): O(log k)
 * - Peek Root: O(1)
 * - Top-K Selection over N candidates: O(n log k)
 * - Auxiliary Space: O(k)
 */
export class PriorityQueue<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => number;
  private comparisonsCount: number = 0;
  private swapsCount: number = 0;

  /**
   * @param comparator - Returns negative if a < b, 0 if equal, positive if a > b.
   * For a Min-Heap: (a, b) => a - b
   * For a Max-Heap: (a, b) => b - a
   */
  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): T | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public offer(item: T): void {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  public poll(): T | null {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return root;
  }

  private siftUp(index: number): void {
    let curr = index;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      this.comparisonsCount++;
      if (this.comparator(this.heap[curr], this.heap[parent]) < 0) {
        this.swap(curr, parent);
        curr = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let curr = index;
    const length = this.heap.length;
    while (true) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let smallest = curr;

      if (left < length) {
        this.comparisonsCount++;
        if (this.comparator(this.heap[left], this.heap[smallest]) < 0) {
          smallest = left;
        }
      }

      if (right < length) {
        this.comparisonsCount++;
        if (this.comparator(this.heap[right], this.heap[smallest]) < 0) {
          smallest = right;
        }
      }

      if (smallest !== curr) {
        this.swap(curr, smallest);
        curr = smallest;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    this.swapsCount++;
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  public toArray(): T[] {
    return [...this.heap];
  }

  public getStats() {
    return {
      comparisons: this.comparisonsCount,
      swaps: this.swapsCount,
      totalOperations: this.comparisonsCount + this.swapsCount
    };
  }

  public resetStats(): void {
    this.comparisonsCount = 0;
    this.swapsCount = 0;
  }
}
