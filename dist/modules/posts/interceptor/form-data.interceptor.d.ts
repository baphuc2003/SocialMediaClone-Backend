import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
export declare class FormDataInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<T>;
}
