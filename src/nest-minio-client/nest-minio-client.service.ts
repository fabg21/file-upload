import { Inject, Injectable } from '@nestjs/common';
import * as btoa from 'btoa';
import { MINIO_CONNECTION } from '../constants';

@Injectable()
export class NestMinioClientService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient) {}

  async uploadFile(bucket, fileName, filePath, metaData) {
    try {
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
    const filePath = `${folderPath}/${fileName}`;
    try {
      const file = await this.minioClient.fGetObject(
        bucket,
        fileName,
        filePath,
      );
      console.log(file);
      return file;
    } catch (err) {
      console.log(err);
    }
  }

  getFileAsStream(bucket, fileName) {
    console.log('hello!!!');
    try {
      const file: Promise<any> = this.minioClient.getObject(bucket, fileName);
      return file
        .then(stream => stream)
        .then(stream => {
          return new Promise<any>((resolve, reject) => {
            // let data = '';
            // fs.createReadStream()
            let data = Buffer.from('');
            // console.log(data);
            stream.on('data', chunk => (data = Buffer.concat([data, chunk])));
            stream.on('end', () => resolve(data));
            stream.on('error', error => reject(error));
          });
        })
        .then((buffer: Buffer) =>
          btoa(
            new Uint8Array(buffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          ),
        )
        .catch(err => console.log('an error occured!!!', err));
    } catch (err) {
      console.error('an error occured');
    }
  }
}
