import {
  Body,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AccessTokenGuard } from "../users/guards/access-token.guard";
import { UserVerifyGuard } from "../users/guards/user-verify.guard";
import { GetListNotificationDto } from "./dto/get-list-notification.dto";
import { NotificationService } from "./notification.service";
import { PaginationQueryDto } from "./dto/query-pagination-notification.dto";

@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  @UsePipes(new ValidationPipe())
  @Get("/get-list-notification")
  async getNotification(
    @Query() query: GetListNotificationDto & PaginationQueryDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const { receiverId, page = 1, limit = 5 } = query;
    const result = await this.notificationService.listNotification(
      receiverId,
      page,
      limit
    );
    return res.status(200).json({
      message: "Get list notification successfully!",
      data: result,
    });
  }
}
