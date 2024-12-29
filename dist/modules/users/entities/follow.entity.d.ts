import { UserEntity } from "./users.entity";
export declare class FollowEntity {
    id: string;
    user: UserEntity;
    followingUser: UserEntity;
    created_at: Date;
}
