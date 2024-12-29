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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let MailService = class MailService extends bullmq_1.WorkerHost {
    async process(job, token) {
        switch (job.name) {
            case "send-email": {
                await this.sendRegistrationConfirmation(job.data);
                return;
            }
            case "send-forgot-password-email": {
                console.log(1);
                await this.sendForgotPasswordConfirmation(job.data);
                return;
            }
        }
        return;
    }
    constructor(mailerService) {
        super();
        this.mailerService = mailerService;
    }
    async sendRegistrationConfirmation({ email, userId, token, }) {
        const url = `http://${process.env.HOST_SERVER}:${process.env.PORT_SERVER}/api/auth/confirm?token=${token}&userId=${userId}`;
        await this.mailerService.sendMail({
            to: email,
            subject: "Welcome to our service! Confirm your Email",
            template: "./confirmation",
            context: {
                url,
            },
        });
    }
    async sendForgotPasswordConfirmation({ email, userId, token, }) {
        const resetUrl = `http://${process.env.HOST_SERVER}:${process.env.PORT_SERVER}/api/auth/reset-password?token=${token}&userId=${userId}`;
        await this.mailerService.sendMail({
            to: email,
            subject: "Welcome to our service! Confirm your Email",
            template: "./forgot-password",
            context: {
                resetUrl,
            },
        });
    }
    async handleSendEmail(data) {
        console.log("Email data received:", data);
        console.log("Sending email to:", data.email);
    }
};
exports.MailService = MailService;
__decorate([
    (0, microservices_1.EventPattern)("send_email"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailService.prototype, "handleSendEmail", null);
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    (0, bullmq_1.Processor)("emailQueue"),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map