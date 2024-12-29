import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
export declare class ListPostInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): any;
}
