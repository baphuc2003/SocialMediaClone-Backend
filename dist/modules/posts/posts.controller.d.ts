import { PostEntity } from "./entities/post.entity";
import { Repository } from "typeorm";
import { HashtagEntity } from "./entities/hashtag.entity";
import { UserEntity } from "../users/entities/users.entity";
import { Request, Response } from "express";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostsService } from "./posts.service";
export declare class PostsController {
    private readonly postRepository;
    private readonly userRepository;
    private readonly hashtagRepository;
    private postService;
    constructor(postRepository: Repository<PostEntity>, userRepository: Repository<UserEntity>, hashtagRepository: Repository<HashtagEntity>, postService: PostsService);
    createPost(file: Express.Multer.File[], body: CreatePostDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    likePost(postId: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    unlikePost(postId: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getFollow(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getListPost(page: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
