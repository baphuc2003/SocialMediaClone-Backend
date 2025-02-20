import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { ElasticsearchService } from "./elasticsearch.service";
import { Response } from "express";

@Controller("elasticsearch")
export class ElasticsearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Post("/search")
  async search(@Body() body: { name: string }, @Res() res: Response) {
    const { name } = body;

    if (!name) return;
    const query = {
      query: {
        match: {
          full_name: name,
        },
      },
    };
    const result = await this.elasticsearchService.search("users", query);
    return res.status(200).json({
      message: "Success",
      result,
    });
  }
}
