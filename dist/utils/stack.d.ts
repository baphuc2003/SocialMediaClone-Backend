import { Node } from "./node";
export declare class Stack<T> {
    private top;
    private size;
    constructor();
    push(value: T): void;
    pop(): Node<T>;
    isEmpty(): boolean;
}
