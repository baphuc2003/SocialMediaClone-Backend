import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SingleConversationEntity } from "../entities/single-conversation.entity";
import { Repository } from "typeorm";
export declare class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly singleConversationRepository;
    server: Server;
    constructor(singleConversationRepository: Repository<SingleConversationEntity>);
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
