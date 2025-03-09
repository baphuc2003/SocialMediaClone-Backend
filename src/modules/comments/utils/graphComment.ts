import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Node } from "src/utils/node";
import { GraphCommentDocument } from "../schemas/graph-comment.schema";
import { Stack } from "src/utils/stack";

interface IVertexId {
  id: string;
}

interface IGraphCommentVertex extends IVertexId {
  userId: string;
  edge?: string[] | null;
}

export class CommentGraph {
  public adjList: Map<string, IGraphCommentVertex>;

  constructor() {
    this.adjList = new Map();
  }

  addVertex(value: IGraphCommentVertex) {
    if (!this.adjList.get(value.id)) {
      this.adjList.set(value.id, {
        id: value.id,
        userId: value.userId,
        edge: [],
      });
    }
  }

  addEdge(vertex1: IGraphCommentVertex, vertex2: IGraphCommentVertex) {
    if (!this.adjList.get(vertex1.id)) {
      this.addVertex(vertex1);
    }
    if (!this.adjList.get(vertex2.id)) {
      this.addVertex(vertex2);
    }
    const node = this.adjList.get(vertex1.id);
    node?.edge?.push(vertex2.id);
    //update new vertex 1;
    this.adjList.set(vertex1.id, {
      id: vertex1.id,
      userId: vertex1.userId,
      edge: node?.edge,
    });
    console.log("check 116 ", this.adjList);
    return this;
  }

  DFS(graph: CommentGraph, startRoot: string) {
    const visited = new Set<string>();
    const stack = new Stack<IVertexId>();
    const result = [];

    visited.add(startRoot);
    let count = 1;

    stack.push({ id: startRoot });
    let maxLength = graph.adjList.get(startRoot)?.edge?.length as number;

    while (!stack.isEmpty()) {
      const neighbors = graph.adjList.get(stack.pop().value.id);

      if (count > maxLength) break;
      if (count !== 1) {
        result.push(neighbors?.id);
      }

      if (neighbors && Array.isArray(neighbors.edge)) {
        for (let vertexId of neighbors.edge) {
          if (!visited.has(vertexId)) {
            if (count > maxLength) break;
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
