import {
  GoneException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { verifyToken } from "src/utils/jwt";
import { PublicKeyEntity } from "../public-key/public-key.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../users/entities/users.entity";
import { Status } from "src/constants/user.enum";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { hashPassword } from "src/utils/bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PublicKeyEntity)
    private readonly publicKeyRepository: Repository<PublicKeyEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async verifyToken({
    userId,
    token,
    req,
  }: {
    userId: string;
    token: string;
    req: Request;
  }) {
    //get public key in DB
    const publicKey = await this.publicKeyRepository.findOne({
      where: {
        userId: userId,
      },
    });
    console.log("check 41 ", publicKey);
    req.publicKey = publicKey;
    try {
      const decoded = await verifyToken({ token, signature: publicKey.token });
      await this.usersRepository.update(
        { id: userId },
        { status: Status.Verified, updated_at: new Date() }
      );

      const user = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });
      req.user = user;

      return decoded;
    } catch (error) {
      if (error.message?.includes("jwt expired")) {
        return new GoneException("Token expried. Need to refresh token");
      }
      return new UnauthorizedException("Please login again");
    }
  }

  async verifyForgotPasswordToken({
    userId,
    token,
    password,
  }: {
    userId: string;
    token: string;
    password: string;
  }) {
    const publicKey = await this.publicKeyRepository.findOne({
      where: {
        userId: userId,
      },
    });

    if (!publicKey) {
      throw new UnauthorizedException("User id doesn't correct");
    }

    try {
      //decoded token
      const decodedToken = await verifyToken({
        token,
        signature: publicKey.token,
      });

      // // hash password
      const hashed = await hashPassword(password);
      console.log("new hash password ", hashed);
      await this.usersRepository.update(
        {
          id: userId,
        },
        {
          password: hashed,
        }
      );
    } catch (error) {
      console.log(error);
      if (error.message?.includes("jwt expired")) {
        throw new GoneException("Token expried. Need to refresh token");
      }
      throw new UnauthorizedException("Please login again");
    }

    return;
  }
}
