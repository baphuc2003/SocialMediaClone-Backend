"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let MediaProcessor = class MediaProcessor extends bullmq_1.WorkerHost {
    async process(job, token) {
        switch (job.name) {
            case "upload-video": {
                console.log("ngu");
                const clientS3 = job.data?.clientS3;
                const command = job.data?.objectCommand;
                await this.uploadFileToS3({
                    s3Client: clientS3,
                    objectCommand: command,
                });
            }
        }
    }
    async uploadFileToS3({ s3Client, objectCommand, }) {
        console.log("kakaka");
        return;
    }
};
exports.MediaProcessor = MediaProcessor;
exports.MediaProcessor = MediaProcessor = __decorate([
    (0, common_1.Injectable)(),
    (0, bullmq_1.Processor)("mediaQueue")
], MediaProcessor);
//# sourceMappingURL=media.processor.js.map