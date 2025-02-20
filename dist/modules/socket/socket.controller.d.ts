import { NotificationGateway } from "./gateways/notification.gateway";
import { SocketService } from "./socket.service";
export declare class SocketController {
    private readonly notificationGateway;
    private socketService;
    constructor(notificationGateway: NotificationGateway, socketService: SocketService);
}
