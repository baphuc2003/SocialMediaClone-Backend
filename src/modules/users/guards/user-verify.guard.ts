import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Status } from "src/constants/user.enum";
import { ITypeToken } from "src/utils/jwt";

@Injectable()
export class UserVerifyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const accessToken: ITypeToken = request.accessToken;
    if (accessToken.status !== Status.Verified) {
      throw new UnauthorizedException("Unauthenticated user");
    }

    return true;
  }
}
