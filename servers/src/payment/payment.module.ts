// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CacheModule } from '@nestjs/cache-manager';  // Nếu dùng cache
import { PrismaModule } from '../prisma/prisma.module';  // Import PrismaModule

@Module({
  imports: [ // Import PrismaService
    CacheModule.register(),  // Optional cache
    PrismaModule,  // Import PrismaModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],  // Export nếu dùng ở OrderModule
})
export class PaymentModule {}