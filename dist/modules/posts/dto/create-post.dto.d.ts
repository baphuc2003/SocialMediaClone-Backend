export declare class CreatePostDto {
    type: string;
    userId: string;
    content: string | null;
    isExistMedia: boolean;
    view: number;
    hashtag: string[] | null;
    mediaUrls: string[] | null;
    like: number;
    shared: number;
    created_at: Date;
}
