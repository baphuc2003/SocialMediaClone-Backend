"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
require("dotenv/config");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api");
    app.enableCors({
        origin: [
            "http://127.0.0.1:5500",
            "http://127.0.0.1:5173",
            "http://localhost:5173",
            "http://127.0.0.1:5174",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "Range"],
        credentials: true,
    });
    app.use(cookieParser());
    await app.listen(process.env.PORT_SERVER || 3000, "0.0.0.0");
    console.log(`Sever is running on port ${process.env.PORT_SERVER}`);
}
bootstrap();
//# sourceMappingURL=main.js.map