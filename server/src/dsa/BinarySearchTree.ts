/**
 * Binary Search Tree (BST) for Dynamic Fleet Indexing
 * Hierarchical key-value storage for live fleet records.
 *
 * Complexity:
 * - Insert: O(log n) average, O(n) worst-case (skewed)
 * - Search: O(log n) average, O(n) worst-case
 * - Delete: O(log n) average, O(n) worst-case
 * - In-Order Traversal: O(n) (produces monotonically sorted keys)
 */

export interface VisualTreeNode {
  key: number;
  label: string;
  payload: any;
  height: number;
  balanceFactor: number;
  left: VisualTreeNode | null;
  right: VisualTreeNode | null;
}

export class BSTNode<T> {
  public key: number;
  public value: T;
  public left: BSTNode<T> | null = null;
  public right: BSTNode<T> | null = null;

  constructor(key: number, value: T) {
    this.key = key;
    this.value = value;
  }
}

export class BinarySearchTree<T> {
  private root: BSTNode<T> | null = null;
  private sizeCount: number = 0;
  private comparisonsCount: number = 0;

  public insert(key: number, value: T): void {
    const newNode = new BSTNode(key, value);
    if (!this.root) {
      this.root = newNode;
      this.sizeCount++;
      return;
    }

    let current = this.root;
    while (true) {
      this.comparisonsCount++;
      if (key < current.key) {
        if (!current.left) {
          current.left = newNode;
          this.sizeCount++;
          break;
        }
        current = current.left;
      } else if (key > current.key) {
        if (!current.right) {
          current.right = newNode;
          this.sizeCount++;
          break;
        }
        current = current.right;
      } else {
        current.value = value;
        break;
      }
    }
  }

  public search(key: number): { node: BSTNode<T> | null; comparisons: number } {
    let current = this.root;
    let comparisons = 0;

    while (current) {
      comparisons++;
      if (key === current.key) {
        return { node: current, comparisons };
      } else if (key < current.key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return { node: null, comparisons };
  }

  public delete(key: number): boolean {
    const initialSize = this.sizeCount;
    this.root = this.deleteRecursive(this.root, key);
    return this.sizeCount < initialSize;
  }

  private deleteRecursive(node: BSTNode<T> | null, key: number): BSTNode<T> | null {
    if (!node) return null;

    if (key < node.key) {
      node.left = this.deleteRecursive(node.left, key);
      return node;
    } else if (key > node.key) {
      node.right = this.deleteRecursive(node.right, key);
      return node;
    } else {
      this.sizeCount--;

      // Case 1: Leaf
      if (!node.left && !node.right) {
        return null;
      }

      // Case 2: Single child
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case 3: Two children
      let successor = node.right;
      while (successor.left) {
        successor = successor.left;
      }

      node.key = successor.key;
      node.value = successor.value;
      this.sizeCount++;
      node.right = this.deleteRecursive(node.right, successor.key);
      return node;
    }
  }

  public inOrder(): { key: number; value: T }[] {
    const result: { key: number; value: T }[] = [];
    this.inOrderRecursive(this.root, result);
    return result;
  }

  private inOrderRecursive(node: BSTNode<T> | null, result: { key: number; value: T }[]): void {
    if (!node) return;
    this.inOrderRecursive(node.left, result);
    result.push({ key: node.key, value: node.value });
    this.inOrderRecursive(node.right, result);
  }

  public preOrder(): { key: number; value: T }[] {
    const result: { key: number; value: T }[] = [];
    this.preOrderRecursive(this.root, result);
    return result;
  }

  private preOrderRecursive(node: BSTNode<T> | null, result: { key: number; value: T }[]): void {
    if (!node) return;
    result.push({ key: node.key, value: node.value });
    this.preOrderRecursive(node.left, result);
    this.preOrderRecursive(node.right, result);
  }

  public getHeight(node: BSTNode<T> | null = this.root): number {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  public getBalanceFactor(node: BSTNode<T> | null): number {
    if (!node) return 0;
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  public size(): number {
    return this.sizeCount;
  }

  public clear(): void {
    this.root = null;
    this.sizeCount = 0;
    this.comparisonsCount = 0;
  }

  public toVisualTree(node: BSTNode<T> | null = this.root): VisualTreeNode | null {
    if (!node) return null;
    return {
      key: node.key,
      label: `${node.key}`,
      payload: node.value,
      height: this.getHeight(node),
      balanceFactor: this.getBalanceFactor(node),
      left: this.toVisualTree(node.left),
      right: this.toVisualTree(node.right)
    };
  }
}
