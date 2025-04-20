import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ElasticsearchService as NestElasticsearchService } from "@nestjs/elasticsearch";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/users.entity";
import { Repository } from "typeorm";
import type { Client } from "@opensearch-project/opensearch";
import { OPENSEARCH_CLIENT } from "./opensearch.provider";

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client: Client;
  constructor(
    @Inject(OPENSEARCH_CLIENT)
    private readonly opensearchClient: any,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async onModuleInit() {
    this.client = this.opensearchClient as Client;
    const indexExists = await this.opensearchClient.indices.exists({
      index: "users_v1",
    });

    if (!indexExists.body) {
      await this.migrateData();
      console.log("Created index and migrated data");
    }
  }

  async searchUser(keyword: string, page = 1, size = 5) {
    if (!keyword || keyword.trim() === "") {
      return [];
    }
    const from = (page - 1) * size;
    const result = await this.opensearchClient.search({
      index: "users_v1", // Tên index
      body: {
        from,
        size,
        query: {
          match: {
            name: {
              query: keyword.trim(),
              operator: "and",
              fuzziness: "AUTO",
            },
          },
        },
      },
    });

    return result?.body?.hits?.hits.map((hit: any) => hit._source);
  }

  async migrateData() {
    // Tạo index nếu chưa tồn tại
    await this.opensearchClient.indices.create(
      {
        index: "users_v1",
        body: {
          settings: {
            analysis: {
              // analyzer: {
              //   autocomplete: {
              //     tokenizer: "autocomplete_tokenizer",
              //     filter: ["lowercase"],
              //   },
              // },
              // tokenizer: {
              //   autocomplete_tokenizer: {
              //     type: "edge_ngram",
              //     min_gram: 1,
              //     max_gram: 20,
              //     token_chars: ["letter", "digit"],
              //   },
              // },
              filter: {
                autocomplete_filter: {
                  type: "edge_ngram",
                  min_gram: 1,
                  max_gram: 20,
                },
              },
              analyzer: {
                autocomplete: {
                  type: "custom",
                  tokenizer: "standard",
                  filter: ["lowercase", "autocomplete_filter"],
                },
                no_diacritic_analyzer: {
                  type: "custom",
                  tokenizer: "standard",
                  filter: ["lowercase", "asciifolding"],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: "keyword" },
              name: {
                type: "text",
                analyzer: "autocomplete",
                search_analyzer: "standard",
              },
            },
          },
        },
      },
      { ignore: [400] }
    );

    const users = await this.usersRepository.find();
    console.log("Users to migrate:", users);

    if (!users.length) {
      console.log("No users to migrate.");
      return;
    }

    const body = users.flatMap((user) => [
      { index: { _index: "users_v1" } },
      {
        id: user.id,
        name: user.username,
      },
    ]);

    const { body: bulkResponse } = await this.opensearchClient.bulk({
      refresh: true,
      body,
    });
    if (bulkResponse.errors) {
      const erroredDocuments = [];
      bulkResponse.items.forEach((action: any, i: number) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            data: body[i * 2 + 1],
          });
        }
      });
      console.error("Some documents failed to migrate:", erroredDocuments);
    } else {
      console.log("Data migration completed successfully!");
    }
    console.log("Data migration completed successfully!");
  }
}
