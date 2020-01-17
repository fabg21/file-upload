import { Inject, Injectable } from '@nestjs/common';

import { MINIO_CONNECTION } from '../constants';

@Injectable()
export class NestMinioClientService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient) {}

  async uploadFile(bucket, fileName, filePath, metaData) {
      try {
        const etag = await this.minioClient.fPutObject(bucket, fileName, filePath, metaData);
        return etag;
      } catch(err) {
        throw new Error("an error happened while uploading the file");
      }
  }
}
