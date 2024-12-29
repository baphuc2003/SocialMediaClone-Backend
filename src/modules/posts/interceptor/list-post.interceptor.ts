import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { PostEntity } from "../entities/post.entity";
import { map } from "rxjs";

@Injectable()
export class ListPostInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    // const request: Request = context.switchToHttp().getRequest();
    const httpContext = context.switchToHttp();
    const res = httpContext.getResponse();
    return next.handle().pipe(
      map((data: PostEntity) => {
        if (data && typeof data === "object") {
          const { user, ...rest } = data;
          console.log("check 20 ", rest);
          return res.status(200).json({
            message: "Get user successfully!",
            data: {
              ...data,
            },
          });
        }
      })
    );
  }
}
