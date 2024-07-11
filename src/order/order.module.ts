import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './models/order.entity';
import { OrderItem } from './models/order-item.entity';
import { OrderItemService } from './order-item.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClassroomModule } from 'src/classroom/classroom.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    AuthModule,
    UserModule,
    ClassroomModule,
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('STRIPE_API_KEY'),
        apiVersion: '2023-10-16'
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OrderService, OrderItemService],
  controllers: [OrderController]
})
export class OrderModule {}
