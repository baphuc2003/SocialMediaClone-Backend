"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const post_entity_1 = require("./entities/post.entity");
const typeorm_2 = require("typeorm");
const hashtag_entity_1 = require("./entities/hashtag.entity");
const bull_1 = require("@nestjs/bull");
const file_map_1 = require("../media/data-structures/file-map");
const like_entity_1 = require("./entities/like.entity");
const follow_entity_1 = require("../users/entities/follow.entity");
let PostsService = class PostsService {
    constructor(postRepository, postQueue, hashtagRepository, likeRepository, followRepository) {
        this.postRepository = postRepository;
        this.postQueue = postQueue;
        this.hashtagRepository = hashtagRepository;
        this.likeRepository = likeRepository;
        this.followRepository = followRepository;
    }
    async addPost({ req, userId, post, files, }) {
        files.map((file) => {
            (0, file_map_1.addFileToMap)(userId, file);
        });
        const postEntity = new post_entity_1.PostEntity();
        postEntity.type = post.type;
        postEntity.user = req.user;
        postEntity.content = post.content;
        const newHashtags = [];
        for (let i = 0; i < post?.hashtag?.length; i++) {
            const isExistedHashtag = await this.hashtagRepository.findOne({
                where: {
                    name: post?.hashtag[i],
                },
            });
            if (!isExistedHashtag) {
                newHashtags.push(post?.hashtag[i]);
            }
        }
        post.hashtag = newHashtags;
        postEntity.hashtag = newHashtags.map((tag) => {
            const hashtag = new hashtag_entity_1.HashtagEntity();
            hashtag.name = tag;
            return hashtag;
        });
        postEntity.userView = post.view;
        postEntity.like = post.like;
        postEntity.shared = post.shared;
        postEntity.created_at = new Date();
        const job = await this.postQueue.add("create-post", {
            userId,
            post: postEntity,
        });
        const result = await job.finished();
        return result;
        return;
    }
    async likePost({ postId, userId }) {
        if (!postId) {
            throw new common_1.BadRequestException("PostId isn't empty!");
        }
        if (!userId) {
            throw new common_1.BadRequestException("UserId isn't empty!");
        }
        const isPostId = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });
        if (!isPostId) {
            throw new common_1.NotFoundException("Not found post");
        }
        const existingLike = await this.likeRepository.findOne({
            where: {
                post: { id: postId },
                user: { id: userId },
            },
        });
        if (existingLike) {
            throw new common_1.BadRequestException("You already liked this post");
        }
        const like = new like_entity_1.LikeEntity();
        like.post = isPostId;
        like.user = { id: userId };
        await this.likeRepository.save(like);
        isPostId.like = (isPostId.like || 0) + 1;
        await this.postRepository.save(isPostId);
        return isPostId;
    }
    async unlikePost({ postId, userId }) {
        if (!postId) {
            throw new common_1.BadRequestException("PostId isn't empty!");
        }
        if (!userId) {
            throw new common_1.BadRequestException("UserId isn't empty!");
        }
        const isPostId = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });
        if (!isPostId) {
            throw new common_1.NotFoundException("Not found post");
        }
        const existingLike = await this.likeRepository.findOne({
            where: {
                post: { id: postId },
                user: { id: userId },
            },
        });
        if (!existingLike) {
            throw new common_1.BadRequestException("You already unliked this post");
        }
        await this.likeRepository.delete({
            user: { id: userId },
            post: { id: postId },
        });
        isPostId.like = (isPostId.like || 0) - 1;
        await this.postRepository.save(isPostId);
        return isPostId;
    }
    async getListFollow(userId) {
        const listFollow = await this.followRepository.find({
            where: {
                user: { id: userId },
            },
        });
        const listPostOf1Month = await this.postRepository
            .createQueryBuilder("post")
            .where("post.created_at BETWEEN :start AND :end", {
            start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            end: new Date(),
        })
            .orderBy("post.created_at", "DESC")
            .getMany();
        return listPostOf1Month;
    }
    async listPost(page, limit = 5) {
        if (!page || page < 1) {
            throw new common_1.BadRequestException("Number page invalid");
        }
        const skip = (page - 1) * limit;
        const posts = await this.postRepository.find({ skip, take: limit });
        const result = posts
            .map((post) => {
            const now = new Date();
            const created_at_post = new Date(post.created_at);
            const timeElapsed = now.getTime() - created_at_post.getTime();
            const totalHours = Math.floor(timeElapsed / (1000 * 60 * 60));
            const days = Math.floor(totalHours / 24);
            const pointOfPost = Math.abs((post.like - 1) / (totalHours + 2) ** 1.2);
            return {
                ...post,
                user: {
                    id: post?.user?.id,
                    name: post?.user?.username,
                    status: post?.user?.status,
                    role: post?.user?.role,
                    avatar: post?.user?.image,
                },
                point: pointOfPost,
                day_ago: Math.floor(totalHours / 24),
            };
        })
            .sort((a, b) => b.point - a.point);
        return result;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.PostEntity)),
    __param(1, (0, bull_1.InjectQueue)("postQueue")),
    __param(2, (0, typeorm_1.InjectRepository)(hashtag_entity_1.HashtagEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(like_entity_1.LikeEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(follow_entity_1.FollowEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map