import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class UserVerifyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
