"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailController = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const bullmq_2 = require("bullmq");
let MailController = class MailController extends bullmq_1.WorkerHost {
    process(job, token) {
        console.log("check 15 ", job.name);
        switch (job.name) {
            case "send-email": {
                console.log(job.data);
                return;
            }
        }
    }
    constructor(emailQueue) {
        super();
        this.emailQueue = emailQueue;
    }
    demo(data) {
        console.log("check 8 ", data);
    }
};
exports.MailController = MailController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "demo1" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MailController.prototype, "demo", null);
exports.MailController = MailController = __decorate([
    (0, bullmq_1.Processor)("emailQueue"),
    (0, common_1.Controller)("mail"),
    __param(0, (0, bullmq_1.InjectQueue)("emailQueue")),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], MailController);
//# sourceMappingURL=mail.controller.js.map