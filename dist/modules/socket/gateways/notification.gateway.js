"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const single_conversation_entity_1 = require("../entities/single-conversation.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
let NotificationGateway = class NotificationGateway {
    constructor(singleConversationRepository, cacheManager) {
        this.singleConversationRepository = singleConversationRepository;
        this.cacheManager = cacheManager;
        this.connectedClients = new Map();
    }
    afterInit(server) {
        console.log("WebSocket Gateway initialized");
    }
    handleConnection(client, ...args) {
        const userId = client.handshake.query?.userId;
        console.log("check 24 ", userId);
        console.log(`Client connected: ${client.id}`);
        if (userId) {
            this.connectedClients.set(userId, client.id);
        }
        client.on("sendMessage", async (data) => {
            console.log("check data ", data);
            const recipientSocketId = this.connectedClients.get(data.receiverId);
            if (recipientSocketId) {
                console.log("socket id ", recipientSocketId);
                this.server.to(recipientSocketId).emit("receiveMessage", {
                    senderId: data.senderId,
                    content: data.content,
                    created_at: data.created_at,
                });
            }
            const newConversation = new single_conversation_entity_1.SingleConversationEntity();
            newConversation.senderId = data.senderId;
            newConversation.receiverId = data.receiverId;
            newConversation.content = data.content;
            newConversation.created_at = data.created_at;
            newConversation.updated_at = data.created_at;
            try {
                await this.singleConversationRepository.save(newConversation);
                console.log("Saved new conversation:", newConversation);
                await this.cacheManager.del(`chat:${data.senderId}:${data.receiverId}`);
                const updatedConversation = await this.singleConversationRepository.find({
                    where: [
                        { senderId: data.senderId, receiverId: data.receiverId },
                        { senderId: data.receiverId, receiverId: data.senderId },
                    ],
                    order: { created_at: "ASC" },
                });
                await this.cacheManager.set(`chat:${data.senderId}:${data.receiverId}`, updatedConversation, 180);
            }
            catch (error) {
                console.error("Error saving conversation:", error);
            }
        });
    }
    handleDisconnect(client) {
        const userIdToRemove = Array.from(this.connectedClients.entries()).find(([userId, clientId]) => clientId === client.id)?.[0];
        if (userIdToRemove) {
            this.connectedClients.delete(userIdToRemove);
            console.log(`Client disconnected: ${client.id}, userId: ${userIdToRemove}`);
        }
    }
    getConnectedClientIds() {
        return Array.from(this.connectedClients.keys());
    }
    getClientById(userId) {
        return this.connectedClients.get(userId);
    }
    sendDemo({ socketClient, message }) {
        if (socketClient) {
            socketClient.emit("notification", {
                name: "nguyen ba phuc",
            });
        }
        else {
            console.log("Client not found:");
        }
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
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
    }),
    (0, websockets_1.WebSocketGateway)({ namespace: "/" }),
    __param(0, (0, typeorm_1.InjectRepository)(single_conversation_entity_1.SingleConversationEntity)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cache_manager_1.Cache])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map