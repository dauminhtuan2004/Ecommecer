// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';  // Import Auth cho login/register
import { UserModule } from './user/user.module';  // Import User cho CRUD
import { ProductModule } from './product/product.module';  // Import Product nếu có
import { CartModule } from './cart/cart.module';  // Import Cart nếu có
import { OrderModule } from './order/order.module';  // Import Order nếu có
import { UploadModule } from './upload/upload.module';  // Import Upload nếu có
import { CacheModule } from './cache/cache.module';  // Import Redis cache nếu có

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
    AuthModule,  
    UserModule,  
    ProductModule,  
    CartModule,
    OrderModule,
    UploadModule,
    CacheModule
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}