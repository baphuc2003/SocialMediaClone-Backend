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
exports.FormDataValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const create_post_dto_1 = require("../dto/create-post.dto");
const post_enum_1 = require("../../../constants/post.enum");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../../users/entities/users.entity");
const typeorm_2 = require("typeorm");
let FormDataValidationPipe = class FormDataValidationPipe {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async transform(value, metadata) {
        console.log("check 26 ", value);
        const typePost = [
            "type",
            "userId",
            "parentId",
            "content",
            "isExistMedia",
            "view",
            "like",
            "shared",
        ];
        const valJson = JSON.parse(value.post);
        console.log("check 38 ", valJson);
        const postDTO = (0, class_transformer_1.plainToClass)(create_post_dto_1.CreatePostDto, valJson, {
            enableImplicitConversion: true,
        });
        typePost.filter((attr) => {
            if (!(attr in postDTO)) {
                throw new common_1.BadRequestException(`${attr} isn't empty`);
            }
            return;
        });
        global["currentPostType"] = {
            type: postDTO.type,
            content: postDTO.content,
        };
        if (!postDTO.type ||
            !Object.values(post_enum_1.PostType).includes(postDTO.type)) {
            throw new common_1.BadRequestException("Type of post doesn't exists");
        }
        if (postDTO.type.toLocaleLowerCase() === post_enum_1.PostType.Post.toLocaleLowerCase() ||
            postDTO.type.toLocaleLowerCase() === post_enum_1.PostType.Comment.toLocaleLowerCase()) {
            if ((postDTO.content === "" || postDTO.content == null) &&
                postDTO.isExistMedia === false) {
                throw new common_1.BadRequestException("Content of post doesn't exists!");
            }
            else if (postDTO.content) {
                const hashtag = postDTO.content.match(/(?<!\S)#([a-zA-Z0-9]+)(?!\S)/g);
                postDTO.hashtag = hashtag;
                if (postDTO.userId == null) {
                    throw new common_1.BadRequestException("Attribute userId invalid!");
                }
            }
        }
        else if (postDTO.type.toLocaleLowerCase() === post_enum_1.PostType.Repost.toLocaleLowerCase()) {
            if (postDTO.isExistMedia == true) {
                throw new common_1.BadRequestException("Attribute isExistMedia invalid!");
            }
            if (postDTO.userId == null) {
                throw new common_1.BadRequestException("Attribute userId invalid!");
            }
            if (postDTO.content) {
                const hashtag = postDTO.content.match(/(?<!\S)#([a-zA-Z0-9]+)(?!\S)/g);
                postDTO.hashtag = hashtag;
            }
        }
        return postDTO;
    }
};
exports.FormDataValidationPipe = FormDataValidationPipe;
exports.FormDataValidationPipe = FormDataValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FormDataValidationPipe);
//# sourceMappingURL=form-data-validation.pipe.js.map