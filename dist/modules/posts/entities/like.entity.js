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
exports.LikeEntity = void 0;
const users_entity_1 = require("../../users/entities/users.entity");
const typeorm_1 = require("typeorm");
const post_entity_1 = require("./post.entity");
let LikeEntity = class LikeEntity {
};
exports.LikeEntity = LikeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], LikeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.UserEntity, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", users_entity_1.UserEntity)
], LikeEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => post_entity_1.PostEntity, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "postId" }),
    __metadata("design:type", post_entity_1.PostEntity)
], LikeEntity.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LikeEntity.prototype, "created_at", void 0);
exports.LikeEntity = LikeEntity = __decorate([
    (0, typeorm_1.Entity)("like")
], LikeEntity);
//# sourceMappingURL=like.entity.js.map