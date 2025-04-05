import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "./entities/post.entity";
import { Between, Repository } from "typeorm";
import { HashtagEntity } from "./entities/hashtag.entity";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { addFileToMap, fileMap } from "../media/data-structures/file-map";
import { Request } from "express";
import { LikeEntity } from "./entities/like.entity";
import { UserEntity } from "../users/entities/users.entity";
import { FollowEntity } from "../users/entities/follow.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectQueue("postQueue") private postQueue: Queue,
    @InjectQueue("commentQueue") private commentQueue: Queue,
    @InjectRepository(HashtagEntity)
    private readonly hashtagRepository: Repository<HashtagEntity>,
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async addPost({
    req,
    userId,
    post,
    files,
  }: {
    req: Request;
    userId: string;
    post: CreatePostDto;
    files: Express.Multer.File[];
  }) {
    files.map((file) => {
      addFileToMap(userId, file);
    });

    const postEntity = new PostEntity();
    postEntity.type = post.type;
    postEntity.user = req.user;
    postEntity.content = post.content;
    console.log("checck 53 ", postEntity);
    //kiem tra hashtag da ton tai chua
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
    post.hashtag = newHashtags; // Gán lại mảng mới

    postEntity.hashtag = newHashtags.map((tag) => {
      const hashtag = new HashtagEntity();
      hashtag.name = tag;
      return hashtag;
    });
    postEntity.userView = post.view;
    postEntity.like = post.like;
    postEntity.shared = post.shared;
    postEntity.created_at = new Date();
    // postEntity.

    // const job = await this.postQueue.add("create-post", {
    //   userId,
    //   post: postEntity,
    // });
    // console.log("check 83 ", job);
    // const result = await job.finished();
    // console.log("check 85 ", result);
    // //gọi comment queue tạo đồ thị
    // const r = await this.commentQueue.add("create-graphComment", {
    //   userRootId: result?.user?.id,
    //   postRootId: result?.id,
    // });
    // const r2 = await r.finished();
    // console.log("check 90 ", r2);
    // return result;

    try {
      console.log("check 966");
      const job = await this.postQueue.add("create-post", {
        userId,
        post: postEntity,
      });
      console.log("check 83 ", job);
      const result = await job.finished();
      console.log("check 85 ", result);
      //gọi comment queue tạo đồ thị
      const r = await this.commentQueue.add("create-graphComment", {
        userRootId: result?.user?.id,
        postRootId: result?.id,
      });
      const r2 = await r.finished();
      console.log("check 90 ", r2);
      return result;
    } catch (error) {
      console.error("Error adding job to postQueue:", error);
      throw error;
    }
    return;
    //Lưu post
    // const savedPost = await this.postRepository.save(post);
  }

  async likePost({ postId, userId }: { postId: string; userId: string }) {
    if (!postId) {
      throw new BadRequestException("PostId isn't empty!");
    }

    if (!userId) {
      throw new BadRequestException("UserId isn't empty!");
    }

    const isPostId = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!isPostId) {
      throw new NotFoundException("Not found post");
    }

    // Kiểm tra xem người dùng đã like bài viết chưa
    const existingLike = await this.likeRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (existingLike) {
      throw new BadRequestException("You already liked this post");
    }

    const like = new LikeEntity();
    like.post = isPostId;
    like.user = { id: userId } as UserEntity;

    // Lưu vào cơ sở dữ liệu
    await this.likeRepository.save(like);

    // Cập nhật số lượng like cho bài viết (nếu cần)
    isPostId.like = (isPostId.like || 0) + 1;
    await this.postRepository.save(isPostId);
    return isPostId;
  }

  async unlikePost({ postId, userId }: { postId: string; userId: string }) {
    if (!postId) {
      throw new BadRequestException("PostId isn't empty!");
    }

    if (!userId) {
      throw new BadRequestException("UserId isn't empty!");
    }

    const isPostId = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!isPostId) {
      throw new NotFoundException("Not found post");
    }

    // Kiểm tra xem người dùng đã like bài viết chưa
    const existingLike = await this.likeRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (!existingLike) {
      throw new BadRequestException("You already unliked this post");
    }

    //xoa du lieu da like
    await this.likeRepository.delete({
      user: { id: userId },
      post: { id: postId },
    });

    // Cập nhật số lượng like cho bài viết (nếu cần)
    isPostId.like = (isPostId.like || 0) - 1;
    await this.postRepository.save(isPostId);
    return isPostId;
  }

  async getListFollow(userId: string) {
    const listFollow = await this.followRepository.find({
      where: {
        user: { id: userId },
      },
    });

    const listPostOf1Month = await this.postRepository
      .createQueryBuilder("post")
      .where("post.created_at BETWEEN :start AND :end", {
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)), // 1 tháng trước
        end: new Date(), // Hiện tại
      })
      .orderBy("post.created_at", "DESC")
      .getMany();

    return listPostOf1Month;
  }

  async listPost(page: number, limit: number = 5) {
    if (!page || page < 1) {
      throw new BadRequestException("Number page invalid");
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
}
