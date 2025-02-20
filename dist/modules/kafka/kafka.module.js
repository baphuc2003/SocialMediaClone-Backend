"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaModule = void 0;
const common_1 = require("@nestjs/common");
const kafka_producer_service_1 = require("./kafka.producer.service");
const kafka_consumer_service_1 = require("./kafka.consumer.service");
const kafka_controller_1 = require("./kafka.controller");
const microservices_1 = require("@nestjs/microservices");
let KafkaModule = class KafkaModule {
};
exports.KafkaModule = KafkaModule;
exports.KafkaModule = KafkaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: "KAFKA_SERVICE",
                    transport: microservices_1.Transport.KAFKA,
                    options: {
                        client: {
                            brokers: ["localhost:9092"],
                            clientId: "my-kafka-client",
                        },
                        consumer: {
                            groupId: "kafka-consumer",
                        },
                    },
                },
            ]),
        ],
        providers: [kafka_producer_service_1.KafkaProducerService, kafka_consumer_service_1.KafkaConsumerService],
        controllers: [kafka_controller_1.KafkaController],
    })
], KafkaModule);
//# sourceMappingURL=kafka.module.js.map