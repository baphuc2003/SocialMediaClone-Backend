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
exports.GetCommentDto = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class GetCommentDto {
}
exports.GetCommentDto = GetCommentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetCommentDto.prototype, "postRootId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value == "undefined") {
            throw new common_1.BadRequestException("Value of attribute content invalid");
        }
        return value == "null" || value == null ? null : value;
    }),
    __metadata("design:type", String)
], GetCommentDto.prototype, "startRootId", void 0);
//# sourceMappingURL=get-comment.dto.js.map