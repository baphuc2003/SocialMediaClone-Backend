"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormFileValidation = void 0;
const common_1 = require("@nestjs/common");
const post_enum_1 = require("../../../constants/post.enum");
let FormFileValidation = class FormFileValidation {
    transform(value, metadata) {
        console.log("check val ", value);
        const postType = global["currentPostType"];
        if ((postType?.type.toLocaleLowerCase() ==
            post_enum_1.PostType.Post.toLocaleLowerCase() ||
            postType?.type.toLocaleLowerCase() ==
                post_enum_1.PostType.Comment.toLocaleLowerCase()) &&
            postType.content == null) {
            if (!value) {
                throw new common_1.BadRequestException("Content of post doesn't exists!");
            }
        }
        else if (postType?.type.toLocaleLowerCase() == post_enum_1.PostType.Repost.toLocaleLowerCase()) {
            if (value.length > 0) {
                throw new common_1.BadRequestException("Photos or videos cannot be attached");
            }
        }
        return value;
    }
};
exports.FormFileValidation = FormFileValidation;
exports.FormFileValidation = FormFileValidation = __decorate([
    (0, common_1.Injectable)()
], FormFileValidation);
//# sourceMappingURL=forn-file-validation.pipe.js.map