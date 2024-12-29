import { PublicKeyEntity } from "./modules/public-key/public-key.entity";
import { FollowEntity } from "./modules/users/entities/follow.entity";
import { UserEntity } from "./modules/users/entities/users.entity";
import { ITypeToken } from "./utils/jwt";

declare global {
  namespace Express {
    interface Request {
      publicKey?: PublicKeyEntity;
      privateKey?: string;
      user?: UserEntity;
      accessToken?: ITypeToken;
      followingUser?: UserEntity;
      // Thêm các thuộc tính khác nếu cần
    }
  }
}
