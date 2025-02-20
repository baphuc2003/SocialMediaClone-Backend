"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticsearchModule = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_service_1 = require("./elasticsearch.service");
const elasticsearch_1 = require("@elastic/elasticsearch");
const elasticsearch_controller_1 = require("./elasticsearch.controller");
let ElasticsearchModule = class ElasticsearchModule {
};
exports.ElasticsearchModule = ElasticsearchModule;
exports.ElasticsearchModule = ElasticsearchModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            elasticsearch_service_1.ElasticsearchService,
            {
                provide: "ELASTICSEARCH_CLIENT",
                useFactory: () => {
                    return new elasticsearch_1.Client({
                        node: "http://localhost:9200",
                    });
                },
            },
        ],
        exports: ["ELASTICSEARCH_CLIENT", elasticsearch_service_1.ElasticsearchService],
        controllers: [elasticsearch_controller_1.ElasticsearchController],
    })
], ElasticsearchModule);
//# sourceMappingURL=elasticsearch.module.js.map