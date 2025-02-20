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

interface IConversationParam {
  receiverId: string;
}

@Controller("socket")
export class SocketController {
  constructor(
    private readonly notificationGateway: NotificationGateway,
    private socketService: SocketService
  ) {}
}
