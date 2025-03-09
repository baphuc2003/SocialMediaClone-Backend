export declare class CreateCommentDto {
    readonly parentId: string | null;
    readonly content: string;
    postRootId: string | null;
    userRootId: string;
    readonly created_at: Date;
}
