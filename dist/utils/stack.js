"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
const node_1 = require("./node");
class Stack {
    constructor() {
        this.top = null;
        this.size = 0;
    }
    push(value) {
        const newNode = new node_1.Node(value);
        newNode.next = this.top;
        this.top = newNode;
        this.size++;
    }
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        else {
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
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map