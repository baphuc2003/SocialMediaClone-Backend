import { Media } from "src/constants/media.enum";
import { UserEntity } from "src/modules/users/entities/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("media")
export class MediaEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "" })
  filename: string;

  @Column({ default: "" })
  fileUrl: string;

  @Column({ default: "" })
  fileType: string; // image/jpeg, image/png, video/mp4

  @Column({ default: "" })
  mediaType: Media; // Loại media

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  duration: number; // Chỉ dành cho video

  @Column({ nullable: true })
  resolution: string; // Chỉ dành cho video

  @ManyToOne(() => UserEntity, (user) => user.media, { onDelete: "CASCADE" })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
