import { UserEntity } from "src/modules/users/entities/users.entity";
import { PostEntity } from "./post.entity";
export declare class LikeEntity {
    id: string;
    user: UserEntity;
    post: PostEntity;
    created_at: Date;
}
