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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
const mongoose_2 = require("mongoose");
const graphComment_1 = require("./utils/graphComment");
const mongoose_3 = require("mongoose");
const bull_1 = require("@nestjs/bull");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../users/entities/users.entity");
const typeorm_2 = require("typeorm");
let CommentsService = class CommentsService {
    constructor(commentModel, graphCommentModel, usersRepository, commentQueue) {
        this.commentModel = commentModel;
        this.graphCommentModel = graphCommentModel;
        this.usersRepository = usersRepository;
        this.commentQueue = commentQueue;
    }
    async createComment({ userId, content, postRootId, userRootId, parentId, }) {
        const isExistedGraph = await this.checkGraphComment({
            postRootId: postRootId,
        });
        if (!isExistedGraph) {
            throw new common_1.NotFoundException("Not found a graph!");
        }
        if (parentId && parentId !== "null") {
            if (!mongoose_3.Types.ObjectId.isValid(parentId)) {
                throw new common_1.BadRequestException(`ParentId invalid: ${parentId}`);
            }
            const commentParent = await this.commentModel.findOne({
                _id: new mongoose_3.Types.ObjectId(parentId),
            });
            if (!commentParent) {
                throw new common_1.NotFoundException("Not found the parentId");
            }
        }
        const newComment = new this.commentModel({
            userId: userId,
            parentId: parentId,
            postRootId: postRootId,
            content: content,
            replyCount: 0,
            created_at: new Date(),
        });
        console.log("check 84 ", newComment);
        const savedComment = await newComment.save();
        const insertedId = savedComment._id.toString();
        if (parentId && parentId !== "null") {
            await this.commentModel.updateOne({ _id: parentId }, { $inc: { replyCount: 1 } });
        }
        const graph = new graphComment_1.CommentGraph();
        for (const [id, vertex] of Object.entries(isExistedGraph.graph)) {
            graph.adjList.set(id, vertex);
        }
        const updatedToGraph = graph.addEdge({
            id: parentId && parentId !== "null" ? parentId : postRootId,
            userId: userRootId,
        }, { id: insertedId, userId: userId });
        await this.graphCommentModel.updateOne({
            userRootId: userRootId,
            postRootId: postRootId,
        }, {
            $set: {
                graph: updatedToGraph.adjList,
            },
        });
        return newComment;
    }
    async getComment({ postRootId, startRootId, }) {
        const isExistedGraph = await this.checkGraphComment({
            postRootId: postRootId,
        });
        if (!isExistedGraph) {
            throw new common_1.NotFoundException("Not found a graph!");
        }
        const graph = new graphComment_1.CommentGraph();
        for (const [id, vertex] of Object.entries(isExistedGraph?.graph)) {
            graph.adjList.set(id, vertex);
        }
        const listNode = graph.DFS(graph, startRootId);
        const objectIdArray = listNode.map((id) => new mongoose_3.Types.ObjectId(id));
        const comments = await this.commentModel.find({
            _id: { $in: objectIdArray },
        });
        const userIds = [...new Set(comments.map((comment) => comment.userId))];
        console.log("check 143 ", userIds);
        const listInfoUser = await this.usersRepository.find({
            where: {
                id: (0, typeorm_2.In)(userIds),
            },
            select: ["id", "username", "gender", "image"],
        });
        const userMap = new Map(listInfoUser.map((user) => [user.id, user]));
        const result = comments.map((comment) => ({
            ...comment.toObject(),
            user: userMap.get(comment.userId) || null,
            replyCount: comment.replyCount || 0,
        }));
        console.log("check 154 ", listInfoUser);
        return result;
    }
    async checkGraphComment({ postRootId }) {
        return await this.graphCommentModel.findOne({
            postRootId: postRootId,
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __param(1, (0, mongoose_1.InjectModel)("Graph_Comment")),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.UserEntity)),
    __param(3, (0, bull_1.InjectQueue)("commentQueue")),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        typeorm_2.Repository, Object])
], CommentsService);
//# sourceMappingURL=comments.service.js.map