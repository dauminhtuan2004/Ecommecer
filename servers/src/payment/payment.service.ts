// src/payment/payment.service.ts (sửa lỗi TS: import BadRequestException, fix transactionId type)
import { Injectable, Inject, BadRequestException } from '@nestjs/common'; // ✅ Thêm BadRequestException
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Optional cache
  ) {}

  async create(data: CreatePaymentDto) {
    // Validate order exists
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
    });
    if (!order) {
      throw new BadRequestException('Order not found'); // ✅ Import đã fix TS2304
    }

    // Generate transactionId nếu method là VNPAY/MOMO (stub – expand với real gateway)
    let transactionId: string | null = null; // ✅ Fix TS2322: Type string | null
    if (data.method === 'VNPAY' || data.method === 'MOMO') {
      transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Stub ID
      // Thực tế: Gọi VNPAY/MOMO API để generate real transaction
      // await this.processExternalPayment(data, transactionId);
    }

    const payment = await this.prisma.payment.create({
      data: {
        ...data,
        amount: order.total, // Total đã bao gồm thuế
        transactionId,
      },
      include: { order: true }, // Include order details
    });

    // Invalidate cache nếu có
    await this.cacheManager.del('payments:all');
    await this.cacheManager.del(`payment:${payment.id}`);

    return payment;
  }

  async findOne(id: number) {
    const cacheKey = `payment:${id}`;
    let payment = await this.cacheManager.get(cacheKey);
    if (payment) {
      return payment;
    }

    payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: { include: { orderItems: { include: { variant: true } } } },
      },
    });

    if (payment) {
      await this.cacheManager.set(cacheKey, payment, 1800); // 30 phút
    }

    return payment;
  }

  async updateStatus(id: number, data: UpdatePaymentStatusDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: { include: { orderItems: true } } },
    });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    const updatedPayment = await this.prisma.$transaction(async (prisma) => {
      // Update payment status
      const paymentUpdated = await prisma.payment.update({
        where: { id },
        data: { status: data.status },
        include: { order: true },
      });

      if (data.status === 'SUCCESS') {
        // Update order status & paymentId (fix null)
        await prisma.order.update({
          where: { id: payment.orderId },
          data: {
            status: 'PROCESSING',
            paymentId: payment.id, // ✅ Fix null paymentId
          },
        });

        // Trừ stock từ variants
        for (const item of payment.order.orderItems) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        console.log(`Stock deducted for order ${payment.orderId}`);
      }

      return paymentUpdated;
    });

    // Cache invalidate
    await this.cacheManager.del(`payment:${id}`);
    await this.cacheManager.del('payments:all');
    await this.cacheManager.del(`order:${payment.orderId}`);
    await this.cacheManager.del('products:all');

    return updatedPayment;
  }
  async findAll(query: QueryPaymentDto) {
    const { page = 1, limit = 10, status, method } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where['status'] = status;
    if (method) where['method'] = method;

    const [payments, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: { 
          order: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          } 
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    // Cache key
    const cacheKey = `payments:${JSON.stringify(query)}`;
    await this.cacheManager.set(cacheKey, { payments, total }, 3600);

    return {
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Stub method cho external payment (expand sau)
  private async processExternalPayment(
    data: CreatePaymentDto,
    transactionId: string,
  ) {
    // Ví dụ VNPAY: Gọi API VNPAY để tạo transaction
    // await this.vnpayService.createTransaction(data.orderId, transactionId, data.amount);
    console.log('Processing external payment for', transactionId);
  }
}
