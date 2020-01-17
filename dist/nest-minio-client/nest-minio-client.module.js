"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const nest_minio_client_controller_1 = require("./nest-minio-client.controller");
const nest_minio_module_1 = require("../nest-minio.module");
const nest_minio_client_service_1 = require("./nest-minio-client.service");
let NestMinioClientModule = class NestMinioClientModule {
};
NestMinioClientModule = __decorate([
    common_1.Module({
        controllers: [nest_minio_client_controller_1.NestMinioClientController],
        imports: [
            nest_minio_module_1.NestMinioModule.register({
                endPoint: '127.0.0.1',
                port: 9000,
                useSSL: false,
                accessKey: 'minioadmin',
                secretKey: 'minioadmin',
            }),
        ],
        providers: [nest_minio_client_service_1.NestMinioClientService]
    })
], NestMinioClientModule);
exports.NestMinioClientModule = NestMinioClientModule;
