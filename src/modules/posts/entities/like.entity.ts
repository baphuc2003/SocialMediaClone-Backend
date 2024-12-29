import { UserEntity } from "src/modules/users/entities/users.entity";
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostEntity } from "./post.entity";

@Entity("like")
export class LikeEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @ManyToOne(() => PostEntity, { eager: false })
  @JoinColumn({ name: "postId" })
  post: PostEntity;

  @CreateDateColumn()
  created_at: Date;
}
