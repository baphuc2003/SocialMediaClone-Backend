"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HideInforUserInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let HideInforUserInterceptor = class HideInforUserInterceptor {
    intercept(context, next) {
        const httpContext = context.switchToHttp();
        const req = httpContext.getRequest();
        const res = httpContext.getResponse();
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            if (data && typeof data === "object") {
                const { id, password, status, role, ...rest } = data;
                return res.status(200).json({
                    message: "Get user successfully!",
                    data: {
                        user: {
                            ...rest,
                        },
                    },
                });
            }
        }));
    }
};
exports.HideInforUserInterceptor = HideInforUserInterceptor;
exports.HideInforUserInterceptor = HideInforUserInterceptor = __decorate([
    (0, common_1.Injectable)()
], HideInforUserInterceptor);
//# sourceMappingURL=hide-user-data.interceptor.js.map