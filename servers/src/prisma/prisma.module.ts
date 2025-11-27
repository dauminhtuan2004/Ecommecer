// src/prisma/prisma.module.ts (tạo mới nếu chưa có)
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // Global để export cho tất cả modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // Export để PaymentModule dùng
})
export class PrismaModule {}