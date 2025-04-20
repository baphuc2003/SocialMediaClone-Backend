import { UserEntity } from "src/modules/users/entities/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum NotificationType {
  FRIEND_REQUEST = "FRIEND_REQUEST",
  MESSAGE = "MESSAGE",
  SYSTEM = "SYSTEM",
}

@Entity("notifications")
export class NotificationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  receiver: UserEntity;

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type: NotificationType;

  @Column("json")
  data: any;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isSent: boolean;

  @Column({ default: false })
  cc: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
