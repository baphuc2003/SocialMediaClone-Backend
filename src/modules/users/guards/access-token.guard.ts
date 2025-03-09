import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
  GoneException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { PublicKeyEntity } from "src/modules/public-key/public-key.entity";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { decodedToken, ITypeToken, verifyToken } from "src/utils/jwt";
import { Repository } from "typeorm";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    @InjectRepository(PublicKeyEntity)
    private readonly publicKeyRepository: Repository<PublicKeyEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token?.accessToken) {
      throw new UnauthorizedException("Please login again");
    }

    try {
      const decodedAccessToken = (await decodedToken(
        token?.accessToken
      )) as ITypeToken | null;

      if (!decodedAccessToken) {
        throw new UnauthorizedException("Access token invalid");
      }

      const { userId } = decodedAccessToken;

      const [user, publicKey] = await Promise.all([
        this.usersRepository.findOne({
          where: {
            id: userId,
          },
        }),
        this.publicKeyRepository.findOne({
          where: {
            userId: userId,
          },
        }),
      ]);

      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (!publicKey) {
        throw new NotFoundException("Public key doesn't exist");
      }

      request.user = user;

      const verifiedAccessToken = (await verifyToken({
        token: token.accessToken,
        signature: publicKey.token,
      })) as ITypeToken;

      request.accessToken = verifiedAccessToken;

      return true;
    } catch (error) {
      console.log("check error: ", error);
      if (error.message?.includes("jwt expired")) {
        throw new GoneException("Need to refresh token");
      }
      throw new UnauthorizedException("Please Login Again!");
    }
  }

  private extractTokenFromHeader(request: Request): any {
    const cookies = request.headers.cookie
      ?.split(";")
      .reduce((init, cookie) => {
        const [key, value] = cookie.trim().split("=");
        init[key] = value;
        return init;
      }, {});
    return cookies;
  }
}
