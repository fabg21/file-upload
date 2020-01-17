export declare class NestMinioClientService {
    private readonly minioClient;
    constructor(minioClient: any);
    uploadFile(bucket: any, fileName: any, filePath: any, metaData: any): Promise<any>;
}
