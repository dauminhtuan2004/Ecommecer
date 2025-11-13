import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CartModule } from '../cart/cart.module';  // Import để resolve CartService

@Module({
  imports: [CartModule],  // Fix: Thêm để Nest inject CartService vào OrderService
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  exports: [OrderService],  // Optional, nếu module khác cần OrderService
})
export class OrderModule {}