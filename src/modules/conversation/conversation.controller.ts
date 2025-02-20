import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../users/guards/access-token.guard";
import { UserVerifyGuard } from "../users/guards/user-verify.guard";
import { Request, Response } from "express";
import { ConversationService } from "./conversation.service";

@Controller("conversation")
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get("get-single-conversation/receiver/:receiverId")
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  async getSingleConversation(
    @Req() req: Request,
    @Param("receiverId") receiverId: string,
    @Res() res: Response
  ) {
    const userId = req.accessToken?.userId;
    console.log("check 35 ", receiverId);
    const result = await this.conversationService.getSingleConversation({
      senderId: userId,
      receiverId: receiverId,
    });

    return res.status(200).json({
      message: "Get single conversation successfully!",
      data: result,
    });
  }
}
