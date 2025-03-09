import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { Request, Response } from "express";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { AccessTokenGuard } from "../users/guards/access-token.guard";
import { UserVerifyGuard } from "../users/guards/user-verify.guard";
import { GetCommentDto } from "./dto/get-comment.dto";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  @Post("create-comment")
  async createComment(
    @Body("comment") comment: CreateCommentDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req.accessToken?.userId;
    console.log("check userId ", userId);
    const result = await this.commentService.createComment({
      userId,
      content: comment.content,
      userRootId: comment.userRootId,
      postRootId: comment.postRootId,
      parentId: comment.parentId,
    });

    return res.status(200).json({
      message: "Create new comment successfully!",
      result,
    });
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  @Get("get-comment/:postRootId/:startRootId")
  async getComment(
    @Param("postRootId") postRootId: string, // Lấy postRootId từ param
    @Param("startRootId") startRootId: string,
    @Res() res: Response
  ) {
    const result = await this.commentService.getComment({
      postRootId: postRootId,
      startRootId: startRootId,
    });
    return res.status(200).json({
      message: "get comment successfully!",
      result,
    });
  }
}
