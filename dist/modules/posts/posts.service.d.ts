import { CreatePostDto } from "./dto/create-post.dto";
import { PostEntity } from "./entities/post.entity";
import { Repository } from "typeorm";
import { HashtagEntity } from "./entities/hashtag.entity";
import { Queue } from "bull";
import { Request } from "express";
import { LikeEntity } from "./entities/like.entity";
import { FollowEntity } from "../users/entities/follow.entity";
export declare class PostsService {
    private readonly postRepository;
    private postQueue;
    private commentQueue;
    private readonly hashtagRepository;
    private readonly likeRepository;
    private readonly followRepository;
    constructor(postRepository: Repository<PostEntity>, postQueue: Queue, commentQueue: Queue, hashtagRepository: Repository<HashtagEntity>, likeRepository: Repository<LikeEntity>, followRepository: Repository<FollowEntity>);
    addPost({ req, userId, post, files, }: {
        req: Request;
        userId: string;
        post: CreatePostDto;
        files: Express.Multer.File[];
    }): Promise<any>;
    likePost({ postId, userId }: {
        postId: string;
        userId: string;
    }): Promise<PostEntity>;
    unlikePost({ postId, userId }: {
        postId: string;
        userId: string;
    }): Promise<PostEntity>;
    getListFollow(userId: string): Promise<PostEntity[]>;
    listPost(page: number, limit?: number): Promise<{
        user: {
            id: string;
            name: string;
            status: string;
            role: string;
            avatar: string;
        };
        point: number;
        day_ago: number;
        id: string;
        type: string;
        content: string;
        hashtag: HashtagEntity[];
        likes: LikeEntity[];
        mediaUrls: import("./interface/post.interface").IMedia[];
        userView: number;
        like: number;
        shared: number;
        created_at: Date;
    }[]>;
}
