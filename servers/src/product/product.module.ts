import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';


@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, UploadService],
})
export class ProductModule {}