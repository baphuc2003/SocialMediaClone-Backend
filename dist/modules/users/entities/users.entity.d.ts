import { MediaEntity } from "src/modules/media/entities/media.entity";
export declare class UserEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    hashPassword(): Promise<void>;
    role: string;
    gender: string;
    status: string;
    image: string;
    media: MediaEntity[];
    followingCount: number;
    created_at: Date;
    updated_at: Date;
    setDates(): void;
}
