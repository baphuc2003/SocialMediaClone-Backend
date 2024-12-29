import { Controller, Get } from "@nestjs/common";

@Controller("conversation")
export class ConversationController {
  @Get("get-single-conversation")
  async getSingleConversation() {
    
  }
}
