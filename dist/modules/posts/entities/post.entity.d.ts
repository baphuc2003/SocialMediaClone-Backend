import { HashtagEntity } from "./hashtag.entity";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { IMedia } from "../interface/post.interface";
import { LikeEntity } from "./like.entity";
export declare class PostEntity {
    id: string;
    user: UserEntity;
    type: string;
    content: string;
    hashtag: HashtagEntity[];
    likes: LikeEntity[];
    mediaUrls: IMedia[];
    userView: number;
    like: number;
    shared: number;
    created_at: Date;
}
