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
/**
 *  NestMinioClientController is a testing controller that verifies that
 *  NestMinioModule was generated properly.
 *
 *  You can quickly verify this by running `npm run start:dev`, and then
 *  connecting to `http://localhost:3000` with your browser.  It should return
 *  a custom message like `Hello from NestMinioModule`.
 *
 *  Once you begin customizing NestMinioModule, you'll probably want
 *  to delete this controller.
 */
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const nest_minio_client_service_1 = require("./nest-minio-client.service");
let NestMinioClientController = class NestMinioClientController {
    constructor(minioService) {
        this.minioService = minioService;
    }
    index() {
        return 'hello';
    }
    uploadFile(destination, file) {
        const metaData = {
            'Content-Type': 'application/octet-stream',
            'X-Amz-Meta-Testing': 1234,
            example: 5678,
        };
        const bucket = destination;
        const fileName = file.filename;
        const filePath = file.path;
        return rxjs_1.from(this.minioService.uploadFile(bucket, fileName, filePath, metaData)).pipe(operators_1.map(etag => ({ fileName, etag, originalName: file.originalname })), operators_1.catchError(err => rxjs_1.of(err)));
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NestMinioClientController.prototype, "index", null);
__decorate([
    common_1.Post('upload/:destination'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: (req, file, cb) => exports.setFileDestination(req, file, cb),
            filename: (req, file, cb) => exports.setFileName(req, file, cb),
        }),
    })),
    __param(0, common_1.Param('destination')), __param(1, common_1.UploadedFile('file')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NestMinioClientController.prototype, "uploadFile", null);
NestMinioClientController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [nest_minio_client_service_1.NestMinioClientService])
], NestMinioClientController);
exports.NestMinioClientController = NestMinioClientController;
exports.setFileDestination = (req, file, cb) => {
    const destination = req.params.destination;
    const filePath = `${process.cwd()}/tmp_files/${!!destination ? destination : 'unknown'}`;
    if (!fs_1.existsSync(filePath)) {
        fs_1.mkdirSync(filePath, { recursive: true });
    }
    return cb(null, filePath);
};
exports.setFileName = (req, file, cb) => {
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    return cb(null, `${randomName}${path_1.extname(file.originalname)}`);
};
