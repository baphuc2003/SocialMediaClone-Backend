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
exports.KafkaConsumerService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const kafkajs_1 = require("kafkajs");
let KafkaConsumerService = class KafkaConsumerService {
    constructor() {
        this.kafka = new kafkajs_1.Kafka({
            brokers: ["localhost:9092"],
        });
        this.consumers = [];
    }
    async consume(topics, configs) {
        const consumer = this.kafka.consumer({ groupId: "nestjs-kafka" });
        await consumer.connect();
        await consumer.subscribe(topics);
        await consumer.run(configs);
        this.consumers.push(consumer);
    }
    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }
    async handleEvent(message) {
        console.log("check 21 ", message);
    }
};
exports.KafkaConsumerService = KafkaConsumerService;
__decorate([
    (0, microservices_1.EventPattern)("topic-name"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KafkaConsumerService.prototype, "handleEvent", null);
exports.KafkaConsumerService = KafkaConsumerService = __decorate([
    (0, common_1.Injectable)()
], KafkaConsumerService);
//# sourceMappingURL=kafka.consumer.service.js.map