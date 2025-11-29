import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // Get total counts
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalCustomers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);

    // Calculate total revenue from delivered orders
    const revenueData = await this.prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { total: true },
    });

    const totalRevenue = revenueData._sum.total || 0;

    // Get low stock products (stock < 10)
    const lowStockCount = await this.prisma.productVariant.count({
      where: { stock: { lt: 10 } },
    });

    return {
      users: {
        total: totalUsers,
        customers: totalCustomers,
        admins: totalUsers - totalCustomers,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockCount,
      },
      categories: {
        total: totalCategories,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
      },
      revenue: {
        total: totalRevenue,
        currency: 'VND',
      },
    };
  }

  async getRevenueAnalytics() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Get revenue by month for current year
    const monthlyRevenue = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        status: 'DELIVERED',
        createdAt: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31, 23, 59, 59),
        },
      },
      _sum: { total: true },
    });

    // Process monthly data
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: 0,
      orders: 0,
    }));

    monthlyRevenue.forEach((item) => {
      const month = new Date(item.createdAt).getMonth();
      monthlyData[month].revenue += Number(item._sum.total) || 0;
      monthlyData[month].orders += 1;
    });

    // Get daily revenue for current month
    const dailyRevenue = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        status: 'DELIVERED',
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lte: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59),
        },
      },
      _sum: { total: true },
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      revenue: 0,
      orders: 0,
    }));

    dailyRevenue.forEach((item) => {
      const day = new Date(item.createdAt).getDate() - 1;
      dailyData[day].revenue += Number(item._sum.total) || 0;
      dailyData[day].orders += 1;
    });

    return {
      monthly: monthlyData,
      daily: dailyData,
      year: currentYear,
      month: currentMonth + 1,
    };
  }

  async getRecentOrders(limit: number = 10) {
    const orders = await this.prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return orders;
  }

  async getTopProducts(limit: number = 10) {
    // Get order items with variant information
    const orderItems = await this.prisma.orderItem.findMany({
      include: {
        variant: {
          include: {
            product: {
              include: {
                category: { select: { name: true } },
                brand: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    // Group by product and calculate totals
    const productMap = new Map<
      number,
      {
        product: any;
        totalSold: number;
        orderCount: number;
      }
    >();

    orderItems.forEach((item) => {
      const productId = item.variant.product.id;
      const existing = productMap.get(productId);

      if (existing) {
        existing.totalSold += item.quantity;
        existing.orderCount += 1;
      } else {
        productMap.set(productId, {
          product: item.variant.product,
          totalSold: item.quantity,
          orderCount: 1,
        });
      }
    });

    // Convert to array and sort by total sold
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);

    return topProducts;
  }
}
