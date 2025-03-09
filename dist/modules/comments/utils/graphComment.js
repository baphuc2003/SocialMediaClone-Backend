"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentGraph = void 0;
const stack_1 = require("../../../utils/stack");
class CommentGraph {
    constructor() {
        this.adjList = new Map();
    }
    addVertex(value) {
        if (!this.adjList.get(value.id)) {
            this.adjList.set(value.id, {
                id: value.id,
                userId: value.userId,
                edge: [],
            });
        }
    }
    addEdge(vertex1, vertex2) {
        if (!this.adjList.get(vertex1.id)) {
            this.addVertex(vertex1);
        }
        if (!this.adjList.get(vertex2.id)) {
            this.addVertex(vertex2);
        }
        const node = this.adjList.get(vertex1.id);
        node?.edge?.push(vertex2.id);
        this.adjList.set(vertex1.id, {
            id: vertex1.id,
            userId: vertex1.userId,
            edge: node?.edge,
        });
        console.log("check 116 ", this.adjList);
        return this;
    }
    DFS(graph, startRoot) {
        const visited = new Set();
        const stack = new stack_1.Stack();
        const result = [];
        visited.add(startRoot);
        let count = 1;
        stack.push({ id: startRoot });
        let maxLength = graph.adjList.get(startRoot)?.edge?.length;
        while (!stack.isEmpty()) {
            const neighbors = graph.adjList.get(stack.pop().value.id);
            if (count > maxLength)
                break;
            if (count !== 1) {
                result.push(neighbors?.id);
            }
            if (neighbors && Array.isArray(neighbors.edge)) {
                for (let vertexId of neighbors.edge) {
                    if (!visited.has(vertexId)) {
                        if (count > maxLength)
                            break;
                        result.push(vertexId);
                        count++;
                        visited.add(vertexId);
                        stack.push({ id: vertexId });
                    }
                }
            }
        }
        return result;
    }
}
exports.CommentGraph = CommentGraph;
//# sourceMappingURL=graphComment.js.map