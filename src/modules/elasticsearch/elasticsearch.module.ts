import { Module, Global } from "@nestjs/common";
import { ElasticsearchService } from "./elasticsearch.service";
import { Client } from "@elastic/elasticsearch";
import { ElasticsearchController } from "./elasticsearch.controller";

@Global() // Để module này có thể được sử dụng toàn cục trong ứng dụng
@Module({
  providers: [
    ElasticsearchService, // Thêm ElasticsearchService vào providers
    {
      provide: "ELASTICSEARCH_CLIENT",
      useFactory: (): Client => {
        return new Client({
          node: "http://localhost:9200", // Thay đổi nếu Elasticsearch của bạn chạy ở địa chỉ khác
        });
      },
    },
  ],
  exports: ["ELASTICSEARCH_CLIENT", ElasticsearchService], // Export cả ElasticsearchService
  controllers: [ElasticsearchController],
})
export class ElasticsearchModule {}
