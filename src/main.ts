import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { Server } from "socket.io";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  // Bật CORS để chấp nhận yêu cầu từ bất kỳ nguồn nào (hoặc chỉ từ các nguồn cụ thể)
  app.enableCors({
    origin: [
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "http://127.0.0.1:5174",
    ], // Chỉ chấp nhận yêu cầu từ địa chỉ này
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức HTTP được phép
    allowedHeaders: ["Content-Type", "Authorization", "Range"],
    credentials: true, // Các header được phép
  });
  app.use(cookieParser());

  await app.listen(process.env.PORT_SERVER || 3000, "0.0.0.0");
  console.log(`Sever is running on port ${process.env.PORT_SERVER}`);
}
bootstrap();
