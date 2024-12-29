import { PostType } from "src/constants/post.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { HashtagEntity } from "./hashtag.entity";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { MediaEntity } from "src/modules/media/entities/media.entity";
import { IMedia } from "../interface/post.interface";
import { LikeEntity } from "./like.entity";

@Entity("post")
export class PostEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column()
  type: string;

  @Column()
  content: string;

  @ManyToMany(() => HashtagEntity, {
    cascade: true,
  })
  @JoinTable({
    name: "post_hashtag",

    joinColumn: {
      name: "post_id",
      referencedColumnName: "id",
    },

    inverseJoinColumn: {
      name: "hashtag_id",
      referencedColumnName: "id",
    },
  })
  hashtag: HashtagEntity[];

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[]; // Một bài viết có nhiều lượt thích

  // @ManyToMany(() => MediaEntity, {
  //   cascade: true,
  // })
  // @JoinTable({
  //   name: "post_media",
  //   joinColumn: {
  //     name: "post_id",
  //     referencedColumnName: "id",
  //   },
  //   inverseJoinColumn: {
  //     name: "media_id",
  //     referencedColumnName: "id",
  //   },
  // })
  @Column("json", { nullable: true })
  mediaUrls: IMedia[];

  @Column({ default: 0 })
  userView: number;

  @Column({ default: 0 })
  like: number;

  @Column({ default: 0 })
  shared: number;

  @CreateDateColumn()
  created_at: Date;
}
