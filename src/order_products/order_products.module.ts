import { Module } from '@nestjs/common';
import { OrderProductsController } from './order_products.controller';
import { OrderProductsService } from './order_products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderProducts from './entities/order-products.entity';

@Module({
  imports:[TypeOrmModule.forFeature([OrderProducts])],
  controllers: [OrderProductsController],
  providers: [OrderProductsService]
})
export class OrderProductsModule {}
