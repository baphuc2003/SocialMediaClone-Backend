import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SingleConversationEntity } from "../entities/single-conversation.entity";
import { Repository } from "typeorm";
import { Cache } from "@nestjs/cache-manager";
export declare class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly singleConversationRepository;
    private cacheManager;
    server: Server;
    constructor(singleConversationRepository: Repository<SingleConversationEntity>, cacheManager: Cache);
    private connectedClients;
    afterInit(server: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    getConnectedClientIds(): string[];
    getClientById(userId: string): string | undefined;
    sendDemo({ socketClient, message }: {
        socketClient: Socket;
        message: {};
    }): void;
}
