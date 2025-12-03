import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { QueryCartDto } from './dto/query-cart.dto';
import { Prisma, Cart, CartItem, ProductVariant } from '@prisma/client';  // Fix: Import ProductVariant để type variant.price

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCart(userId: number): Promise<any> {
    const cacheKey = `cart:${userId}`;
    // Fix: Thêm | undefined để match cache.get (TS2322)
    let cart: Cart & { cartItems: (CartItem & { variant: ProductVariant })[] } | null | undefined = await this.cacheManager.get(cacheKey);

    if (cart) {
      console.log(`Cache hit for cart ${userId}`);
      const total = cart.cartItems.reduce((sum, item) => sum + (item.quantity * item.variant.price), 0);  // Fix: variant typed đúng, price tồn tại (TS2339)
      return { ...cart, total };
    }

    console.log(`Cache miss for cart ${userId} - querying DB`);
    cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { 
        cartItems: { 
          include: { 
            variant: {
              include: {
                product: {
                  include: {
                    images: true
                  }
                }
              }
            }
          } 
        } 
      },
    });

    if (!cart) throw new NotFoundException('Cart not found');

    const total = cart.cartItems.reduce((sum, item) => sum + (item.quantity * item.variant.price), 0);  // Giờ price typed đúng
    const cartWithTotal = { ...cart, total };

    await this.cacheManager.set(cacheKey, cartWithTotal, 300);
    console.log(`Cache set for cart ${userId}`);
    return cartWithTotal;
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
    let updatedItem;
    if (existingItem) {
      updatedItem = await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    } else {
      updatedItem = await this.prisma.cartItem.create({
        data: { cartId: cart.id, variantId: dto.variantId, quantity: dto.quantity },
      });
    }

    // Invalidate cache sau add
    await this.cacheManager.del(`cart:${userId}`);
    console.log(`Cache invalidated for cart ${userId} after add`);

    return updatedItem;
  }

  async updateItem(userId: number, variantId: number, dto: UpdateCartItemDto): Promise<any> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');
    const item = await this.prisma.cartItem.findUnique({ where: { cartId_variantId: { cartId: cart.id, variantId } } });
    if (!item) throw new NotFoundException('Item not found');
    const updatedItem = await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });

    // Invalidate cache sau update
    await this.cacheManager.del(`cart:${userId}`);
    console.log(`Cache invalidated for cart ${userId} after update`);

    return updatedItem;
  }

  async removeItem(userId: number, dto: RemoveCartItemDto): Promise<any> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');
    const removedItem = await this.prisma.cartItem.delete({
      where: { cartId_variantId: { cartId: cart.id, variantId: dto.variantId } },
    });

    // Invalidate cache sau remove
    await this.cacheManager.del(`cart:${userId}`);
    console.log(`Cache invalidated for cart ${userId} after remove`);

    return removedItem;
  }

  async clearCart(userId: number): Promise<any> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;
    const cleared = await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Invalidate cache sau clear
    await this.cacheManager.del(`cart:${userId}`);
    console.log(`Cache invalidated for cart ${userId} after clear`);

    return cleared;
  }
}