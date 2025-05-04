import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { UserEntity } from "src/modules/users/entities/users.entity";

@Injectable()
export class HideInforUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const res = httpContext.getResponse();
    return next.handle().pipe(
      map((data: UserEntity) => {
        if (data && typeof data === "object") {
          const { password, role, ...rest } = data;
          return res.status(200).json({
            message: "Get user successfully!",
            data: {
              user: {
                ...rest,
              },
            },
          });
        }
      })
    );
  }
}
