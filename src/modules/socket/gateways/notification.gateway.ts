import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { IReceivedMessage } from "../interface/receivedMessage";
import { SingleConversationEntity } from "../entities/single-conversation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotificationEntity } from "src/modules/notification/entities/notification.entity";

@WebSocketGateway({
  cors: {
    origin: [
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5173",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
})
@WebSocketGateway({ namespace: "/" })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    @InjectRepository(SingleConversationEntity)
    private readonly singleConversationRepository: Repository<SingleConversationEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  private connectedClients: Map<string, string> = new Map();

  afterInit(server: Socket) {
    console.log("WebSocket Gateway initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    const userId = client.handshake.query?.userId as string;
    console.log("check 23 ", client.handshake);
    console.log("check 24 ", userId);
    console.log(`Client connected: ${client.id}`);
    // Lưu client
    if (userId) {
      this.connectedClients.set(userId, client.id);
    }

    client.on("sendMessage", async (data: IReceivedMessage) => {
      console.log("check data ", data);
      const recipientSocketId = this.connectedClients.get(data.receiverId);
      if (recipientSocketId) {
        console.log("socket id ", recipientSocketId);
        // Gửi tin nhắn tới client cụ thể
        this.server.to(recipientSocketId).emit("receiveMessage", {
          senderId: data.senderId,
          content: data.content,
          created_at: data.created_at,
        });
      }
      //save
      const newConversation = new SingleConversationEntity();

      newConversation.senderId = data.senderId;
      newConversation.receiverId = data.receiverId;
      newConversation.content = data.content;
      newConversation.created_at = data.created_at;
      newConversation.updated_at = data.created_at;
      try {
        await this.singleConversationRepository.save(newConversation);
        console.log("Saved new conversation:", newConversation);

        await this.cacheManager.del(`chat:${data.senderId}:${data.receiverId}`);

        const updatedConversation =
          await this.singleConversationRepository.find({
            where: [
              { senderId: data.senderId, receiverId: data.receiverId },
              { senderId: data.receiverId, receiverId: data.senderId },
            ],
            order: { created_at: "ASC" },
          });
        await this.cacheManager.set(
          `chat:${data.senderId}:${data.receiverId}`,
          updatedConversation,
          180
        );
      } catch (error) {
        console.error("Error saving conversation:", error);
      }
    });
  }

  handleDisconnect(client: Socket) {
    // Tìm và xóa userId tương ứng với client.id
    const userIdToRemove = Array.from(this.connectedClients.entries()).find(
      ([userId, clientId]) => clientId === client.id
    )?.[0];

    if (userIdToRemove) {
      this.connectedClients.delete(userIdToRemove);
      console.log(
        `Client disconnected: ${client.id}, userId: ${userIdToRemove}`
      );
    }
  }

  // Gửi lời mời kết bạn cho người nhận
  sendFriendRequestNotification(
    receiverId: string,
    sender: {
      username: string;
      image: string;
      gender: string;
    }
  ) {
    const socketId = this.connectedClients.get(receiverId);
    console.log("check 120 ", receiverId);
    console.log("check 121 ", socketId);
    if (socketId) {
      const payload = {
        username: sender.username,
        image: sender.image,
        gender: sender.gender,
        message: `${sender.username} đã gửi cho bạn một lời mời kết bạn.`,
      };
      this.server.to(socketId).emit("friend-request-received", payload);
      console.log("chek 128 ", payload);
    } else {
      console.log(`User ${receiverId} chưa online`);
    }
  }

  // Phương thức trả về danh sách ID của các client
  getConnectedClientIds(): string[] {
    return Array.from(this.connectedClients.keys());
  }

  // Trả về một socket cụ thể qua ID
  getClientById(userId: string): string | undefined {
    return this.connectedClients.get(userId);
  }

  sendDemo({ socketClient, message }: { socketClient: Socket; message: {} }) {
    if (socketClient) {
      socketClient.emit("notification", {
        name: "nguyen ba phuc",
      });
    } else {
      console.log("Client not found:");
    }
    // this.server.emit("notifi", {
    //   name: "nguyen ba phuc",
    // });
  }
}
