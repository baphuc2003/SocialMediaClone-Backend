import { Media } from "src/constants/media.enum";
import { UserEntity } from "src/modules/users/entities/users.entity";
export declare class MediaEntity {
    id: string;
    filename: string;
    fileUrl: string;
    fileType: string;
    mediaType: Media;
    width: number;
    height: number;
    duration: number;
    resolution: string;
    user: UserEntity;
    createdAt: Date;
}
