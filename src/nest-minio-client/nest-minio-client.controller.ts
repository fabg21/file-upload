import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { NestMinioClientService } from './nest-minio-client.service';

@Controller()
export class NestMinioClientController {
  private readonly logger: Logger;

  constructor(private minioService: NestMinioClientService) {
    this.logger = new Logger('NestMinioClientController');
  }

  @Get()
  index() {
    return 'hello';
  }

  @Post('upload/:destination')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => setFileDestination(req, file, cb),
        filename: (req, file, cb) => setHashName(req, file, cb),
      }),
    }),
  )
  uploadFile(@Param('destination') destination, @UploadedFile('file') file) {
    const metaData = {
      'Content-Type': 'application/octet-stream',
      'X-Amz-Meta-Testing': 1234,
      // tslint:disable-next-line: object-literal-key-quotes
      example: 5678,
    };
    const bucket: string = destination;
    const fileName: string = file.filename;
    const filePath = file.path;

    return from(
      this.minioService.uploadFile(bucket, fileName, filePath, metaData),
    ).pipe(
      map(etag => ({ fileName, etag, originalName: file.originalname })),
      catchError(err => of(err)),
    );
  }

  @Get('download/:destination/:fileId')
  downloadFile(
    @Param('destination') bucket,
    @Param('fileId') fileName,
    @Res() res,
  ) {
    this.logger.log(`downloading file ${fileName}`);

    const folderPath = setDestinationPath(bucket);

    if (existsSync(`${folderPath}/${fileName}`)) {
      this.logger.log('serving file from cache');
      res.sendFile(fileName, { root: folderPath });
    } else {
      this.logger.log('serving file from minio server');
      this.minioService
        .downloadFile(bucket, fileName, folderPath)
        .then(() => {
          res.sendFile(fileName, { root: folderPath });
        })
        .catch(err => this.logger.error(err));
    }
  }
}
export const setFileDestination = (req, file, cb) => {
  const dest = req.params.destination;
  return cb(null, setDestinationPath(dest));
};

export const setHashName = (req, file, cb) => {
  const hashedName = getHash(file.originalname);
  return cb(null, `${hashedName}${extname(file.originalname)}`);
};

export const setDestinationPath = (destination: string) => {
  const filePath = getFilePath(destination);
  if (!existsSync(filePath)) {
    createFilePath(filePath);
  }
  return filePath;
};

export const getFilePath = (destination: string) =>
  `${process.cwd()}/tmp_files/${!!destination ? destination : 'unknown'}`;

export const createFilePath = path => mkdirSync(path, { recursive: true });

export const getHash = (
  str: string,
  alg = 'sha1',
  digest: 'hex' | 'latin1' | 'base64' = 'hex',
) =>
  createHash(alg)
    .update(str)
    .digest(digest);
