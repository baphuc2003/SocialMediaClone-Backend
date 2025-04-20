import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./users.entity";

export enum FriendStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

@Entity("friend")
export class MakeFriendEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  receiver: UserEntity;

  @Column({
    type: "enum",
    enum: FriendStatus,
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;

  @Column()
  created_at: Date;
}
