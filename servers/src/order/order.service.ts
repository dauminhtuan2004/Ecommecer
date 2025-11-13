import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private cartService: CartService) {}

  async create(userId: number, dto: CreateOrderDto): Promise<any> {
    const cart = await this.cartService.getCart(userId);
    if (cart.cartItems.length === 0) throw new BadRequestException('Cart empty');

    let discount: any = null;  
    if (dto.discountCode) {
      discount = await this.prisma.discount.findUnique({ where: { code: dto.discountCode } });
      if (!discount || discount.endDate < new Date()) throw new BadRequestException('Invalid discount');
    }

    const totalItems = cart.cartItems.reduce((sum, item) => sum + (item.quantity * item.variant.price), 0);
    const taxAmount = totalItems * 0.1; 
    const total = totalItems + taxAmount;
    let discountedTotal = total;
    if (discount) {
      if (discount.percentage) discountedTotal *= (1 - discount.percentage / 100);
      else if (discount.fixedAmount) discountedTotal -= discount.fixedAmount;
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        addressId: dto.addressId,
        shippingMethodId: dto.shippingMethodId,
        total: discountedTotal,
        taxAmount,
        discountId: discount?.id, 
        status: 'PENDING',
        orderItems: {
          create: cart.cartItems.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant.price,
          })),
        },
      },
      include: { orderItems: { include: { variant: true } }, payment: true },
    });
    await this.cartService.clearCart(userId);

    return order;
  }

  async findAll(userId: number, query: QueryOrderDto): Promise<any> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;
    return this.prisma.order.findMany({
      where: { userId, status },
      skip,
      take: limit,
      include: { orderItems: { include: { variant: true } }, payment: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<any> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: { include: { variant: true } }, payment: true, address: true, discount: true },
    });
  }

  async update(id: number, dto: UpdateOrderDto): Promise<any> {
    return this.prisma.order.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<any> {
    return this.prisma.order.delete({ where: { id } });
  }

  async applyDiscount(orderId: number, dto: ApplyDiscountDto): Promise<any> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    const discount = await this.prisma.discount.findUnique({ where: { code: dto.code } });
    if (!discount) throw new BadRequestException('Invalid discount');
    return { message: 'Discount applied', discount };
  }
}