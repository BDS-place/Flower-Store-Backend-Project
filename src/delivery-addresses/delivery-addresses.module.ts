import { Module } from '@nestjs/common';
import { DeliveryAddressesController } from './delivery-addresses.controller';
import { DeliveryAddressesService } from './delivery-addresses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryAddresses } from './entities/delivery-addresses.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DeliveryAddresses])],
  controllers: [DeliveryAddressesController],
  providers: [DeliveryAddressesService],
  exports:[DeliveryAddressesService]
})
export class DeliveryAddressesModule {}
