interface IVertexId {
    id: string;
}
interface IGraphCommentVertex extends IVertexId {
    userId: string;
    edge?: string[] | null;
}
export declare class CommentGraph {
    adjList: Map<string, IGraphCommentVertex>;
    constructor();
    addVertex(value: IGraphCommentVertex): void;
    addEdge(vertex1: IGraphCommentVertex, vertex2: IGraphCommentVertex): this;
    DFS(graph: CommentGraph, startRoot: string): any[];
}
export {};
