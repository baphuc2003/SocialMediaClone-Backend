import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "./entities/post.entity";
import { Repository } from "typeorm";
import { PostType } from "src/constants/post.enum";
import { HashtagEntity } from "./entities/hashtag.entity";
import { UserEntity } from "../users/entities/users.entity";
import { Media } from "src/constants/media.enum";
import { AccessTokenGuard } from "../users/guards/access-token.guard";
import { UserVerifyGuard } from "../users/guards/user-verify.guard";
import { Request, Response } from "express";
import { CreatePostDto } from "./dto/create-post.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FormDataValidationPipe } from "./pipe/form-data-validation.pipe";
import { ValidationPipe } from "../users/pipes/validation.pipe";
import { FormFileValidation } from "./pipe/forn-file-validation.pipe";
import { FormDataInterceptor } from "./interceptor/form-data.interceptor";
import { MultiFileValidationPipe } from "../media/pipes/multi-file-validation.pipe";
import { ConvertMultiImagePipe } from "../media/pipes/convert-multi-mime-file.pipe";
import { PostsService } from "./posts.service";
import { LikePostDto } from "./dto/like-post.dto";
import { ListPostInterceptor } from "./interceptor/list-post.interceptor";

@Controller("post")
export class PostsController {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(HashtagEntity)
    private readonly hashtagRepository: Repository<HashtagEntity>,
    private postService: PostsService
  ) {}

  @Post("create-post")
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  @UseInterceptors(FilesInterceptor("file"))
  async createPost(
    @UploadedFiles(
      new FormFileValidation(),
      new MultiFileValidationPipe(),
      new ConvertMultiImagePipe()
    )
    file: Express.Multer.File[],
    @Body(FormDataValidationPipe)
    body: CreatePostDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req.accessToken?.userId;
    console.log("check 65", userId);
    const result = await this.postService.addPost({
      req,
      userId,
      post: body,
      files: file,
    });

    return res.status(201).json({
      message: "Create a new post successfully!",
    });
  }

  @Post("like-post")
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  async likePost(
    @Body("postId") postId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req.accessToken?.userId;
    const result = await this.postService.likePost({
      postId: postId,
      userId: userId,
    });

    return res.status(201).json({
      message: "Like post successfully!",
      data: result,
    });
  }

  @Post("unlike-post")
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  async unlikePost(
    @Body("postId") postId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req.accessToken?.userId;

    const result = await this.postService.unlikePost({
      postId: postId,
      userId: userId,
    });

    return res.status(201).json({
      message: "Post unliked successfully!",
      data: result,
    });
  }

  @Get("list-follow")
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  async getFollow(@Req() req: Request, @Res() res: Response) {
    const userId = req.accessToken?.userId;
    const result = await this.postService.getListFollow(userId);
    return res.status(201).json({
      message: "Get list follow successfully!",
      data: result,
    });
  }

  @Get("get-list-post")
  // @UseInterceptors(ListPostInterceptor)
  async getListPost(@Query("page") page: number, @Res() res: Response) {
    const result = await this.postService.listPost(page);
    return res.status(200).json({
      message: "Get list post successfully!",
      data: result,
    });
    // return result;
  }
}
