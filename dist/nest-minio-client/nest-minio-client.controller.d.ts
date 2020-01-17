import { NestMinioClientService } from './nest-minio-client.service';
export declare class NestMinioClientController {
    private minioService;
    constructor(minioService: NestMinioClientService);
    index(): string;
    uploadFile(destination: any, file: any): import("rxjs").Observable<any>;
}
export declare const setFileDestination: (req: any, file: any, cb: any) => any;
export declare const setFileName: (req: any, file: any, cb: any) => any;
