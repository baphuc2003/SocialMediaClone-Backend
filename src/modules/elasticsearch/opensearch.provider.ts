import { ConfigService } from "@nestjs/config";
import { Provider } from "@nestjs/common";

export const OPENSEARCH_CLIENT = "OPENSEARCH_CLIENT";

export const opensearchProvider: Provider = {
  provide: OPENSEARCH_CLIENT,
  useFactory: async (configService: ConfigService) => {
    //Import dynamic theo ESM
    const { Client } = await import("@opensearch-project/opensearch");

    const client = new Client({
      node: configService.get<string>("ELASTICSEARCH_NODE"),
      auth: {
        username: configService.get<string>("ELASTICSEARCH_USERNAME"),
        password: configService.get<string>("ELASTICSEARCH_PASSWORD"),
      },
      ssl: {
        rejectUnauthorized: false, // Nếu dùng self-signed cert
      },
    });

    return client;
  },
  inject: [ConfigService],
};
