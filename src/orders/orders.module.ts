import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DeliveryAddressesModule } from 'src/delivery-addresses/delivery-addresses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Orders]),DeliveryAddressesModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
