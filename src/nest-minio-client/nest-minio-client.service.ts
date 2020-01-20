import { Inject, Injectable } from '@nestjs/common';
import { MINIO_CONNECTION } from '../constants';

@Injectable()
export class NestMinioClientService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient) {}

  async uploadFile(bucket, fileName, filePath, metaData) {
    try {
      await this.checkBucket(bucket, true);

      const etag = await this.minioClient.fPutObject(
        bucket,
        fileName,
        filePath,
        metaData,
      );
      if (!etag) {
        throw new Error();
      }
      return etag;
    } catch (err) {
      throw new Error('an error happened while uploading the file');
    }
  }

  async downloadFile(bucket: string, fileName: string, folderPath: string) {
    await this.checkBucket(bucket);

    const filePath = `${folderPath}/${fileName}`;

    try {
      const file = await this.minioClient.fGetObject(
        bucket,
        fileName,
        filePath,
      );
      return file;
    } catch (err) {
      console.log(err);
      throw new Error(`an error occured while fetching the file : ${err}`);
    }
  }

  private async checkBucket(bucket: string, makeBucket = false) {
    try {
      const bucketExists: boolean = await this.minioClient.bucketExists(bucket);
      if (!bucketExists) {
        if (makeBucket) {
          await this.minioClient.makeBucket(bucket);
        } else {
          throw new Error('the required bucket does not exist');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
