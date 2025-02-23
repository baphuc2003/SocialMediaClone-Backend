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
exports.ElasticsearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@elastic/elasticsearch");
let ElasticsearchService = class ElasticsearchService {
    constructor(client) {
        this.client = client;
    }
    async search(index, query) {
        const search = await this.client.search({
            index,
            body: query,
            size: 2,
        });
        const result = search.body?.hits?.hits.map(({ _id, _source }) => {
            return { id: _id, full_name: _source?.full_name };
        });
        return result;
    }
};
exports.ElasticsearchService = ElasticsearchService;
exports.ElasticsearchService = ElasticsearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ELASTICSEARCH_CLIENT")),
    __metadata("design:paramtypes", [elasticsearch_1.Client])
], ElasticsearchService);
//# sourceMappingURL=elasticsearch.service.js.map