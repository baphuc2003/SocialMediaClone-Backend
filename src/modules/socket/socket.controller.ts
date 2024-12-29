import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { NotificationGateway } from "./gateways/notification.gateway";
import { AccessTokenGuard } from "../users/guards/access-token.guard";
import { UserVerifyGuard } from "../users/guards/user-verify.guard";
import { SocketService } from "./socket.service";
import { Request, Response } from "express";

interface IConversationBody {
  senderId: string;
  receiverId: string;
}

@Controller("socket")
export class SocketController {
  constructor(
    private readonly notificationGateway: NotificationGateway,
    private socketService: SocketService
  ) {}

  @Get("get-single-conversation")
  async getSingleConversation(@Req() req: Request, @Res() res: Response) {
    const { senderId, receiverId }: IConversationBody = req.body;
    const result = await this.socketService.getSingleConversation({
      senderId: senderId,
      receiverId: receiverId,
    });

    return res.status(200).json({
      message: "Get single conversation successfully!",
      data: result,
    });
  }
}
