import { ElasticsearchService } from "./elasticsearch.service";
import { Response } from "express";
export declare class ElasticsearchController {
    private readonly elasticsearchService;
    constructor(elasticsearchService: ElasticsearchService);
    search(body: {
        name: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
}
