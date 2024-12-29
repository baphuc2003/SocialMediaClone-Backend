import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostEntity } from "./post.entity";

@Entity("hashtag")
export class HashtagEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => PostEntity, (post) => post.hashtag)
  posts: PostEntity[];

  @CreateDateColumn()
  created_at: Date;
}
