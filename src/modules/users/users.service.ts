import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/users.entity";
import { getRepository, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { comparePassword, hashPassword } from "src/utils/bcrypt";
import {
  decodedToken,
  generateToken,
  ITypeToken,
  verifyToken,
} from "src/utils/jwt";
import { TokenType } from "src/constants/token.enum";
import { Status } from "src/constants/user.enum";
import { generateKeyToken } from "src/utils/crypto";
import { PublicKeyEntity } from "../public-key/public-key.entity";
import {
  ClientProxy,
  ClientProxyFactory,
  EventPattern,
  MessagePattern,
  Transport,
} from "@nestjs/microservices";
import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { request, Request } from "express";
import { LoginUserDto } from "./dto/login-user.dto";
import { FollowEntity } from "./entities/follow.entity";
import { FollowUserDto } from "./dto/follow-user.dto";
import { isUUID } from "class-validator";
import { FriendStatus, MakeFriendEntity } from "./entities/make-friend.entity";
import { NotificationGateway } from "../socket/gateways/notification.gateway";
import {
  NotificationEntity,
  NotificationType,
} from "../notification/entities/notification.entity";
import { RabbitMQService } from "../rabbitMq/rabbitmq.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(PublicKeyEntity)
    private readonly publicKeyRepository: Repository<PublicKeyEntity>,
    @InjectQueue("emailQueue") private emailQueue: Queue,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(MakeFriendEntity)
    private readonly makeFriendRepository: Repository<MakeFriendEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly notificationGateway: NotificationGateway,
    private readonly rabbitService: RabbitMQService
  ) {}

  async createUser(dto: CreateUserDto, req: Request) {
    // check uniqueness of username/email
    const { username, email, password, gender } = dto;
    // Sử dụng QueryBuilder để kiểm tra tính duy nhất của username/email

    const qb = this.usersRepository
      .createQueryBuilder("user")
      .where("user.username = :username", { username })
      .orWhere("user.email = :email", { email });

    const user = await qb.getOne();

    if (user) {
      const errors = { username: "Username and email must be unique." };
      throw new HttpException(
        { message: "Input data validation failed", errors },
        HttpStatus.BAD_REQUEST
      );
    }

    // Nếu không có người dùng nào tồn tại, bạn có thể tạo mới
    const newUser = this.usersRepository.create(dto);

    await this.usersRepository.save(newUser);

    const { publicKey, privateKey } = await generateKeyToken();
    req.privateKey = privateKey;
    //generate a new auth token for authentication register
    try {
      const authToken = await generateToken({
        payload: {
          type: TokenType.AuthToken,
          userId: newUser.id,
          status: Status.Unverified,
        },
        signature: privateKey,
        options: {
          algorithm: "RS256",
          expiresIn: 60 * 30,
        },
      });
      console.log("check 93");
      await this.emailQueue.add("send-email", {
        email: newUser.email,
        userId: newUser.id,
        token: authToken,
      });

      this.rabbitService.sendMessage("sync_user_queue", "user.created", {
        id: newUser.id,
        name: newUser.username,
      });
    } catch (error) {
      console.log(error);
    }

    //save public key in DB
    const token = this.publicKeyRepository.create({
      userId: newUser.id,
      token: publicKey,
      created_at: new Date(),
    });

    await this.publicKeyRepository.save(token);

    return dto;
  }

  async demo() {
    this.rabbitService.sendMessage("sync_user_queue", "user.created", {
      id: "123",
      name: "yasuo",
    });
  }

  async loginUser(data: LoginUserDto) {
    const { email, password } = data;
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException("Email doesn't exists.");
    }
    const encodedPassword = await comparePassword(password, user.password);

    if (!encodedPassword) {
      throw new UnauthorizedException("Email or Password doesn't correct.");
    }
    const { publicKey, privateKey } = await generateKeyToken();

    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        payload: {
          type: TokenType.AccessToken,
          userId: user.id,
          status: user.status,
        },
        signature: privateKey,
        options: {
          algorithm: "RS256",
          expiresIn: "15m",
        },
      }),
      generateToken({
        payload: {
          type: TokenType.RefreshToken,
          userId: user.id,
          status: user.status,
        },
        signature: privateKey,
        options: {
          algorithm: "RS256",
          expiresIn: "30d",
        },
      }),
      //save new public key
      this.publicKeyRepository.update(
        {
          userId: user.id,
        },
        {
          token: publicKey,
        }
      ),
    ]);

    return {
      userId: user.id,
      username: user.username,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new BadRequestException("Refresh token doesn't empty");
    }

    const decodeToken: ITypeToken = (await decodedToken(token)) as ITypeToken;
    if (!decodeToken) {
      throw new BadRequestException("Refresh token invalid");
    }
    const { userId, status } = decodeToken;
    const publicKeyToken = await this.publicKeyRepository.findOne({
      where: {
        userId: userId,
      },
    });
    if (!publicKeyToken) {
      throw new NotFoundException("Not find public key");
    }
    const verifiedToken = await verifyToken({
      token: token,
      signature: publicKeyToken.token,
    });

    const { publicKey, privateKey } = await generateKeyToken();
    //create new accessToken
    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        payload: {
          type: TokenType.AccessToken,
          userId: userId,
          status: status,
        },
        signature: privateKey,
        options: {
          algorithm: "RS256",
          expiresIn: "5s",
        },
      }),
      generateToken({
        payload: {
          type: TokenType.RefreshToken,
          userId: userId,
          status: status,
        },
        signature: privateKey,
        options: {
          algorithm: "RS256",
          expiresIn: "30d",
        },
      }),
      //save new public key
      this.publicKeyRepository.update(
        {
          userId: userId,
        },
        {
          token: publicKey,
        }
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException("Email doesn't exists");
    }
    const { publicKey, privateKey } = await generateKeyToken();
    // const forgotPasswordToken = await generateToken({
    //   payload: {
    //     type: TokenType.ForgotPasswordToken,
    //     userId: user.id,
    //     status: user.status,
    //   },
    //   signature: privateKey,
    //   options: {
    //     algorithm: "RS256",
    //     expiresIn: 60 * 30,
    //   },
    // });
    const [forgotPasswordToken] = await Promise.all([
      generateToken({
        payload: {
          type: TokenType.ForgotPasswordToken,
          userId: user.id,
          status: user.status,
        },
        signature: privateKey,
        options: {
          algorithm: "RS256",
          expiresIn: 5 * 60 * 1000,
        },
      }),
      this.publicKeyRepository.update(
        {
          userId: user.id,
        },
        {
          token: publicKey,
        }
      ),
    ]);

    await this.emailQueue.add("send-forgot-password-email", {
      email: email,
      userId: user.id,
      token: forgotPasswordToken,
    });

    return {
      userId: user.id,
      "forgot-password-token": forgotPasswordToken,
    };
  }

  async getMe(userId: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException("User doesnt't exists");
    }
    return user;
  }

  async getProfile(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new NotFoundException("User doesn't exists");
    }
    return user;
  }

  async follow(req: Request) {
    // const followed = await this.followRepository.save(followDto);
    const follow = new FollowEntity();
    follow.user = req.user;
    follow.followingUser = req.followingUser;
    follow.created_at = new Date();
    follow.user.password = "";
    follow.followingUser.password = "";
    // Lưu vào database
    const followed = await this.followRepository.save(follow);
    return followed;
  }

  async unfollow(following_user_id: string, req: Request) {
    const userId = req.user?.id;
    if (!following_user_id) {
      throw new BadRequestException("Following user id doesn't exists!");
    }

    if (!isUUID(following_user_id)) {
      throw new BadRequestException(
        "Invalid following user id format. It must be a UUID string."
      );
    }

    const followingUser = await this.usersRepository.findOne({
      where: { id: following_user_id },
    });
    if (!followingUser) {
      throw new NotFoundException("User to unfollow not found");
    }

    const followRecord = await this.followRepository.findOne({
      where: {
        user: { id: userId },
        followingUser: { id: following_user_id },
      },
    });

    if (!followRecord) {
      throw new BadRequestException("You are not following this user");
    }

    // Xóa bản ghi follow
    await this.followRepository.remove(followRecord);
    return { message: "Unfollow successful" };
  }

  async listFollow(userId: string) {
    if (!userId) {
      throw new BadRequestException("UserId invalid");
    }

    const listFollowing = await this.followRepository.find({
      where: {
        user: { id: userId },
      },
    });
    console.log("check listFollowing ", listFollowing);
    const cleanedList = listFollowing.map((follow) => {
      return {
        id: follow.id,
        created_at: follow.created_at,
        user: {
          id: follow.user.id,
          username: follow.user.username,
          image: follow.user.image,
          gender: follow.user.gender,
        },
        followingUser: {
          id: follow.followingUser.id,
          username: follow.followingUser.username,
          image: follow.followingUser.image,
          gender: follow.followingUser.gender,
        },
      };
    });
    return cleanedList;
  }

  async makeFriend({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) {
    if (senderId === receiverId) {
      throw new BadRequestException("Can't send invitations to yourself");
    }

    const [sender, receiver] = await Promise.all([
      this.usersRepository.findOne({
        where: {
          id: senderId,
        },
      }),
      this.usersRepository.findOne({
        where: {
          id: receiverId,
        },
      }),
    ]);

    if (!sender) {
      throw new NotFoundException("SenderId not found!");
    }

    if (!receiver) {
      throw new NotFoundException("ReceiverId not found!");
    }

    const existed = await this.makeFriendRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
    });

    if (existed) {
      throw new BadRequestException(
        "Invitation already exists or is already a friend"
      );
    }

    const newRequest = this.makeFriendRepository.create({
      sender,
      receiver,
      status: FriendStatus.PENDING,
      created_at: new Date(),
    });
    console.log("check 442 ", newRequest);
    await this.makeFriendRepository.save(newRequest);
    // get something infor of sender
    const { username, image, gender } = newRequest.sender;
    const notification = this.notificationRepository.create({
      sender,
      receiver,
      data: {
        message: `${sender.username} đã gởi cho bạn một yêu cầu kết bạn.`,
      },
      createdAt: new Date(),
      type: NotificationType.FRIEND_REQUEST, // Loại thông báo có thể là 'friend-request', 'message', v.v.
    });
    console.log("check 454 ", notification);
    await this.notificationRepository.save(notification);
    // Gửi thông báo qua WebSocket
    this.notificationGateway.sendFriendRequestNotification(receiverId, {
      username: username,
      image: image,
      gender: gender,
    });
  }
}
