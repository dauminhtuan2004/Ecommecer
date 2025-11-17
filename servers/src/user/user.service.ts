// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import * as bcrypt from 'bcrypt';  

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(query: QueryUserDto): Promise<User[]> {
    const { page = 1, limit = 10, role } = query;
    const skip = (page - 1) * limit;
    return this.prisma.user.findMany({
      where: { role },
      skip,
      take: limit,
      include: { addresses: true },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id }, include: { addresses: true } });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const updateData: Prisma.UserUpdateInput = { name: data.name };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async addAddress(userId: number, data: CreateAddressDto): Promise<any> {
    const hasDefault = await this.prisma.address.findFirst({ where: { userId, isDefault: true } });
    const isDefault = !hasDefault && !data.isDefault ? true : data.isDefault;
    return this.prisma.address.create({ 
      data: { userId, ...data, isDefault } 
    });
  }

  async updateAddress(id: number, data: UpdateAddressDto): Promise<any> {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) throw new Error('Address not found');

    if (data.isDefault) {
      await this.prisma.address.updateMany({ 
        where: { 
          userId: address.userId, 
          id: { not: id }, 
          isDefault: true 
        }, 
        data: { isDefault: false } 
      });
    }
    return this.prisma.address.update({ where: { id }, data });
  }
}