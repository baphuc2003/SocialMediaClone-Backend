import { forwardRef, Module } from "@nestjs/common";
import { ElasticsearchModule as NestElasticsearchModule } from "@nestjs/elasticsearch"; // ✅ Đổi alias
import { ElasticsearchController } from "./elasticsearch.controller";
import { ElasticsearchService } from "./elasticsearch.service";
import { UsersModule } from "../users/users.module";
import { OPENSEARCH_CLIENT, opensearchProvider } from "./opensearch.provider";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    // NestElasticsearchModule.register({
    //   node: "http://localhost:9200",
    // }),
    // NestElasticsearchModule.register({
    //   node: process.env.ELASTICSEARCH_NODE,
    //   auth: {
    //     username: process.env.ELASTICSEARCH_USERNAME,
    //     password: process.env.ELASTICSEARCH_PASSWORD,
    //   },
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // }),

    // UsersModule,
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  controllers: [ElasticsearchController],
  providers: [ElasticsearchService, opensearchProvider],
  exports: [OPENSEARCH_CLIENT],
})
export class ElasticsearchModule {}
