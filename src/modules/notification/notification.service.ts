import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationEntity } from "./entities/notification.entity";
import { Repository } from "typeorm";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>
  ) {}

  async listNotification(receiverId: string, page: number, limit: number) {
    if (!page || page < 1) {
      throw new BadRequestException("Number page invalid");
    }

    const [data, total] = await this.notificationRepository.findAndCount({
      where: { receiver: { id: receiverId } },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        sender: true,
        receiver: true,
      },
    });
    console.log("check 22 ", data);
    const notifi = data.map((item) => ({
      type: item.type,
      data: item.data,
      isRead: item.isRead,
      sender: {
        username: item.sender?.username,
        gender: item.sender?.gender,
        image: item.sender?.image,
      },
      createdAt: item.createdAt,
      total,
    }));
    return notifi;
  }
}
