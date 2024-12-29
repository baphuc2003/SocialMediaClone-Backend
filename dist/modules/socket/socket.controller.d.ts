import { NotificationGateway } from "./gateways/notification.gateway";
import { SocketService } from "./socket.service";
import { Request, Response } from "express";
export declare class SocketController {
    private readonly notificationGateway;
    private socketService;
    constructor(notificationGateway: NotificationGateway, socketService: SocketService);
    getSingleConversation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
