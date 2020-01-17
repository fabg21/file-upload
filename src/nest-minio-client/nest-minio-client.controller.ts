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
import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


import { NestMinioClientService } from './nest-minio-client.service';

@Controller()
export class NestMinioClientController {
  constructor(private minioService: NestMinioClientService) {}

  @Get()
  index() {
    return 'hello';
  }

  @Post('upload/:destination')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => setFileDestination(req, file, cb),
        filename: (req, file, cb) => setFileName(req, file, cb),
      }),
    }),
  )
  uploadFile(@Param('destination') destination, @UploadedFile('file') file) {
    const metaData = {
      'Content-Type': 'application/octet-stream',
      'X-Amz-Meta-Testing': 1234,
      example: 5678,
    };
    const bucket: string = destination;
    const fileName: string = file.filename;
    const filePath = file.path;

    return from(this.minioService.uploadFile(bucket, fileName, filePath, metaData)).pipe(
      map(etag => ({fileName, etag, originalName: file.originalname})),
      catchError(err => of(err))
    );
  }
}
export const setFileDestination = (req, file, cb) => {
  const destination = req.params.destination;
  const filePath = `${process.cwd()}/tmp_files/${
    !!destination ? destination : 'unknown'
  }`;
  if (!existsSync(filePath)) {
    mkdirSync(filePath, { recursive: true });
  }
  return cb(null, filePath);
};

export const setFileName = (req, file, cb) => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  return cb(null, `${randomName}${extname(file.originalname)}`);
};
