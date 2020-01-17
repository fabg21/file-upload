import { Module } from '@nestjs/common';
import { NestMinioClientController } from './nest-minio-client.controller';
import { NestMinioModule } from '../nest-minio.module';
import { NestMinioClientService } from './nest-minio-client.service';

@Module({
  controllers: [NestMinioClientController],
  imports: [
    NestMinioModule.register({
      endPoint: '127.0.0.1',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    }),
  ],
  providers: [NestMinioClientService]
})
export class NestMinioClientModule {}
