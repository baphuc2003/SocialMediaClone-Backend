import { Client } from "@elastic/elasticsearch";
export declare class ElasticsearchService {
    private readonly client;
    constructor(client: Client);
    search(index: string, query: any): Promise<any>;
}
