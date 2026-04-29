import { Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypes } from './entities/product-types.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductTypes])],
  providers: [ProductTypesService],
  controllers: [ProductTypesController],
  exports:[ProductTypesService]
})
export class ProductTypesModule {}
