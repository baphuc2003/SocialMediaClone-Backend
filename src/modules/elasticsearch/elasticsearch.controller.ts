import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { ElasticsearchService } from "./elasticsearch.service";
import { Request, Response } from "express";

@Controller("elasticsearch")
export class ElasticsearchController {
  constructor(private readonly searchService: ElasticsearchService) {}

  @Get("users")
  async searchUsers(
    @Query("q") query: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.searchService.searchUser(query);
    return res.status(200).json({
      message: "Result search",
      data: result,
    });
  }
}
