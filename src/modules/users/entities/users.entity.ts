import { IsEmail, IsIn } from "class-validator";
import { MediaEntity } from "src/modules/media/entities/media.entity";
import { hashPassword } from "src/utils/bcrypt";
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hashPassword(this.password);
  }

  @Column({ default: "User" })
  @IsIn(["Admin", "User"])
  role: string;

  @Column()
  @IsIn(["Male", "Female", "Other"])
  gender: string;

  @Column({ default: "Unverified" })
  @IsIn(["Verified", "Unverified", "Banned"])
  status: string;

  @Column({ default: "" })
  image: string;

  @OneToMany(() => MediaEntity, (media) => media.user, { cascade: true })
  media: MediaEntity[];

  @Column({ default: 0 })
  followingCount: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @BeforeInsert()
  setDates() {
    const now = new Date();
    this.created_at = now;
    this.updated_at = now;
  }
}
