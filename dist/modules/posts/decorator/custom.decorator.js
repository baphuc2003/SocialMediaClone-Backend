"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMetadata = void 0;
const common_1 = require("@nestjs/common");
exports.PostMetadata = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.postMetadata;
});
//# sourceMappingURL=custom.decorator.js.map