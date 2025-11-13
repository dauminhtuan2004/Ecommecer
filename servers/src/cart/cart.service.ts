import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { QueryCartDto } from './dto/query-cart.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number): Promise<any> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { variant: { include: { product: true } } } } },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    const total = cart.cartItems.reduce((sum, item) => sum + (item.quantity * item.variant.price), 0);
    return { ...cart, total };
  }

  async addItem(userId: number, dto: AddCartItemDto): Promise<any> {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: dto.variantId } });
    if (!variant || variant.stock < dto.quantity) throw new BadRequestException('Insufficient stock');
    let cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    const existingItem = await this.prisma.cartItem.findUnique({ where: { cartId_variantId: { cartId: cart.id, variantId: dto.variantId } } });
    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    }
    return this.prisma.cartItem.create({
      data: { cartId: cart.id, variantId: dto.variantId, quantity: dto.quantity },
    });
  }

  async updateItem(userId: number, variantId: number, dto: UpdateCartItemDto): Promise<any> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');
    const item = await this.prisma.cartItem.findUnique({ where: { cartId_variantId: { cartId: cart.id, variantId } } });
    if (!item) throw new NotFoundException('Item not found');
    return this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(userId: number, dto: RemoveCartItemDto): Promise<any> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');
    return this.prisma.cartItem.delete({
      where: { cartId_variantId: { cartId: cart.id, variantId: dto.variantId } },
    });
  }

  async clearCart(userId: number): Promise<any> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;
    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}