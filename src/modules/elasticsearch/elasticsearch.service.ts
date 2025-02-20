import { Injectable, Inject } from "@nestjs/common";
import { Client } from "@elastic/elasticsearch";

@Injectable()
export class ElasticsearchService {
  constructor(
    @Inject("ELASTICSEARCH_CLIENT") private readonly client: Client
  ) {}

  async search(index: string, query: any) {
    const search = await this.client.search({
      index,
      body: query,
      size: 2,
    });
    // console.log("check 16 ", search.body?.hits?.hits);
    const result = search.body?.hits?.hits.map(({ _id, _source }) => {
      return { id: _id, full_name: _source?.full_name };
    });

    return result;
  }
}
