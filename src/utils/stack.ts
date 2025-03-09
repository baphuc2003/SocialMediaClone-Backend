import { Node } from "./node";

export class Stack<T> {
  private top: Node<T> | null;
  private size: number;

  constructor() {
    this.top = null;
    this.size = 0;
  }

  push(value: T) {
    const newNode = new Node(value);
    newNode.next = this.top;
    this.top = newNode;
    this.size++;
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    } else {
      const node = this.top;

      this.top.next = this.top;
      this.size--;
      return node;
    }
  }

  isEmpty() {
    return this.size === 0;
  }
}
