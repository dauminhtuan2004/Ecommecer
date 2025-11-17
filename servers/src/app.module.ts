// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';  
import { UserModule } from './user/user.module';  
import { ProductModule } from './product/product.module';  
import { CartModule } from './cart/cart.module';  
import { OrderModule } from './order/order.module'; 
import { UploadModule } from './upload/upload.module'; 
import { CacheModule } from './cache/cache.module';  
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
    AuthModule,  
    UserModule,  
    ProductModule,  
    CartModule,
    OrderModule,
    UploadModule,
    CacheModule,
    CategoryModule
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}