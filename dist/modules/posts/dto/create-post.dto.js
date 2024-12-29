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
exports.CreatePostDto = void 0;
const class_validator_1 = require("class-validator");
const post_enum_1 = require("../../../constants/post.enum");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
class CreatePostDto {
}
exports.CreatePostDto = CreatePostDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)([post_enum_1.PostType.Post, post_enum_1.PostType.Comment, post_enum_1.PostType.Repost]),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], CreatePostDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value === "null" || value === undefined ? null : String(value)),
    __metadata("design:type", String)
], CreatePostDto.prototype, "userId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value == "undefined") {
            throw new common_1.BadRequestException("Value of attribute content invalid");
        }
        return value == "null" ? null : value;
    }),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], CreatePostDto.prototype, "content", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === "string" &&
            value.trim() != "true" &&
            value.trim() != "false") {
            throw new common_1.BadRequestException(`Value of attribute isExistMedia must be a boolean`);
        }
        else {
            return value === true ? true : false;
        }
    }),
    __metadata("design:type", Boolean)
], CreatePostDto.prototype, "isExistMedia", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === "number" && !isNaN(value)) {
            if (value != 0) {
                throw new common_1.BadRequestException("Value of attribute view must be 0");
            }
            return 0;
        }
        else {
            throw new common_1.BadRequestException(`Value of attribute view must be a number`);
        }
    }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePostDto.prototype, "view", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === "number" && !isNaN(value)) {
            if (value != 0) {
                throw new common_1.BadRequestException("Value of attribute view must be 0");
            }
            return 0;
        }
        else {
            throw new common_1.BadRequestException(`Value of attribute view must be a number`);
        }
    }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePostDto.prototype, "like", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === "number" && !isNaN(value)) {
            if (value != 0) {
                throw new common_1.BadRequestException("Value of attribute view must be 0");
            }
            return 0;
        }
        else {
            throw new common_1.BadRequestException(`Value of attribute view must be a number`);
        }
    }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePostDto.prototype, "shared", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreatePostDto.prototype, "created_at", void 0);
//# sourceMappingURL=create-post.dto.js.map