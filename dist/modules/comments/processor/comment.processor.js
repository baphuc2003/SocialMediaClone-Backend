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
exports.CommentProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const graphComment_1 = require("../utils/graphComment");
let CommentProcessor = class CommentProcessor {
    constructor(graphCommentModel) {
        this.graphCommentModel = graphCommentModel;
    }
    async handleCreatePost(job) {
        console.log("check 16 ", job.data);
        const userRootId = job.data?.userRootId;
        const postRootId = job.data?.postRootId;
        const newGraph = new graphComment_1.CommentGraph();
        newGraph.addVertex({
            id: postRootId,
            userId: userRootId,
        });
        console.log("check 26 ", newGraph);
        const graphDoc = new this.graphCommentModel({
            userRootId: userRootId,
            postRootId: postRootId,
            graph: newGraph.adjList,
        });
        console.log("check 32 ", graphDoc);
        const result = await graphDoc.save();
        return result;
    }
};
exports.CommentProcessor = CommentProcessor;
__decorate([
    (0, bull_1.Process)("create-graphComment"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentProcessor.prototype, "handleCreatePost", null);
exports.CommentProcessor = CommentProcessor = __decorate([
    (0, bull_1.Processor)("commentQueue"),
    __param(0, (0, mongoose_1.InjectModel)("Graph_Comment")),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentProcessor);
//# sourceMappingURL=comment.processor.js.map