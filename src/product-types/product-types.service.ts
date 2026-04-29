import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTypes } from './entities/product-types.entity';

@Injectable()
export class ProductTypesService {
    constructor(
        @InjectRepository(ProductTypes)
        private productTypesRepository: Repository<ProductTypes>
    ){}

    async findOneById(id:number):Promise<ProductTypes>{
        const type = await this.productTypesRepository.findOneBy({product_type_id:id});
        if(!type) throw new NotFoundException('Тип продукта не найден');
        return type;
    }
}
