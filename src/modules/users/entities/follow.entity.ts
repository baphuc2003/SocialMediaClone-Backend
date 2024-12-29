import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./users.entity";

@Entity("follows")
export class FollowEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: "followingUserId" })
  followingUser: UserEntity;

  @Column()
  created_at: Date;
}
