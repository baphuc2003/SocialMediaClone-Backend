import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import type { Client } from "@opensearch-project/opensearch"; // ✅ Dùng `type` để tránh lỗi import
// ❌ KHÔNG IMPORT TRỰC TIẾP NỮA

@Controller()
export class RabbitMQConsumer implements OnModuleInit {
  private client: Client;

  constructor(
    @Inject("OPENSEARCH_CLIENT")
    private readonly opensearchClient: any
  ) {}

  onModuleInit() {
    this.client = this.opensearchClient as Client;
  }

  @EventPattern("demo")
  async consumeMessage(message: any) {
    console.log("🎯 Event received:", message);
  }

  @EventPattern("user.created")
  async syncUser(message: any) {
    try {
      console.log("🎯 Event received:", message);

      const indexExists = await this.client.indices.exists({
        index: "users_v1",
      });

      if (indexExists.body) {
        await this.client.index({
          index: "users_v1",
          body: message,
        });
      } else {
        console.warn("❗ Index users_v1 does not exist");
      }
    } catch (error) {
      console.error("❌ Failed to sync user to OpenSearch:", error);
    }
  }
}
