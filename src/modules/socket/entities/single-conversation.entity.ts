import { UserEntity } from "src/modules/users/entities/users.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";

@Entity("SingleConversation")
export class SingleConversationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "senderId" })
  sender: UserEntity;

  @Column()
  senderId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "receiverId" })
  receiver: UserEntity;

  @Column()
  receiverId: string;

  @Column({ nullable: false, type: "text" })
  content: string;

  created_at: Date;

  updated_at: Date;
}
