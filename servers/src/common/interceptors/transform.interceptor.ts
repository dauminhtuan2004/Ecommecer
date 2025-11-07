// src/common/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import type { Type } from '@nestjs/common';  // Fix: Import type chỉ cho Type
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private readonly classRef: Type<T>) {}  // Giờ OK, type-only import

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return plainToClass(this.classRef, data) as T;  // Transform array
        }
        return plainToClass(this.classRef, data) as T;  // Transform single
      }),
    );
  }
}