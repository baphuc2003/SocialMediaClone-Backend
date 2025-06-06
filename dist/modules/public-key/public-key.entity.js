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
exports.PublicKeyEntity = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let PublicKeyEntity = class PublicKeyEntity {
};
exports.PublicKeyEntity = PublicKeyEntity;
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PublicKeyEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PublicKeyEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PublicKeyEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], PublicKeyEntity.prototype, "created_at", void 0);
exports.PublicKeyEntity = PublicKeyEntity = __decorate([
    (0, typeorm_1.Entity)('publicKey')
], PublicKeyEntity);
//# sourceMappingURL=public-key.entity.js.map