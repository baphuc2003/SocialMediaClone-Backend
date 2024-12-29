import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PublicKeyModule } from "../public-key/public-key.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [PublicKeyModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
