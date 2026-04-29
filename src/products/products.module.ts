import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { ProductTypesModule } from 'src/product-types/product-types.module';

@Module({
  imports:[TypeOrmModule.forFeature([Products]),ProductTypesModule],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
