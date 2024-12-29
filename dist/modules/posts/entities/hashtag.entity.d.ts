import { PostEntity } from "./post.entity";
export declare class HashtagEntity {
    id: string;
    name: string;
    posts: PostEntity[];
    created_at: Date;
}
