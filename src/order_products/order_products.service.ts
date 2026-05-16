import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OrderProducts from './entities/order-products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderProductsService {
    constructor(
        @InjectRepository(OrderProducts)
        private readonly orderProductsRepository: Repository<OrderProducts>
    ){}

    async create (createOrderProductDto){
        
    }
}
