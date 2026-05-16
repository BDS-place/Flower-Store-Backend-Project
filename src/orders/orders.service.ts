import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';
import { DataSource, In, Repository } from 'typeorm';
import CreateOrderDto from './dto/create-order.dto';
import { DeliveryAddressesService } from 'src/delivery-addresses/delivery-addresses.service';
import { Products } from 'src/products/entities/products.entity';
import OrderProducts from 'src/order_products/entities/order-products.entity';
import { DeliveryAddresses } from 'src/delivery-addresses/entities/delivery-addresses.entity';
import UpdateOrderDto from './dto/updatre-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private readonly ordersReposiroty: Repository<Orders>,
        private readonly addressRepository: DeliveryAddressesService,
        private readonly dataSource: DataSource
    ){}

    async create(id:number,dto:CreateOrderDto){
        const {delivery_address_id, delivery_address} = dto
        let deliveryAddress: DeliveryAddresses;
        if(delivery_address_id){
            deliveryAddress =  await this.addressRepository.findOneById(delivery_address_id)
        }else if(delivery_address){
            deliveryAddress = await this.addressRepository.create(delivery_address)
        }
        return await this.dataSource.transaction(async(manager)=>{
            const productIds = dto.products.map((p)=>p.product_id)
            const products = await manager.findBy(Products, {product_id: In(productIds)})
            if(products.length !== productIds.length) throw new NotFoundException('Некоторых товаров не существует');

            const productMap = new Map(products.map((p)=>[p.product_id, p]));
            const orderProducts: OrderProducts[] = [];

            for(const item of dto.products){         
                const product = productMap.get(item.product_id)
                if(!product || !product.is_active) throw new BadRequestException(`Товар с id ${item.product_id} недоступен`);
                if(product.stock_quantity < item.quantity) throw new BadRequestException(`Недостаточно товара "${product.name}" на складе`);
                
                const total = +(product.price_per_unit * item.quantity).toFixed(2);
                const orderProduct = manager.create(OrderProducts,{
                    product,
                    quantity:item.quantity,
                    price_per_unit:product.price_per_unit,
                    total_price:total,
                });
                orderProducts.push(orderProduct);
                
                product.stock_quantity -= item.quantity
            }
            const order = manager.create(Orders,{
                user:{user_id:id},
                delivery_address_id: deliveryAddress,
                recipient_name:dto.recipient_name,
                recipient_number:dto.recipient_number,
                customer_comment: dto.customer_comment,
                payment_method: dto.payment_method,
                delivery_date:dto.delivery_date,
                order_status: 'Ожидание',
            });

            await manager.save(order)
            orderProducts.forEach((op)=>(op.order = order));
            await manager.save(orderProducts)

            await manager.save(products)

            return order
        })
    }
    async update(id:number, dto:UpdateOrderDto){
        const {delivery_address_id, delivery_address} = dto
        let deliveryAddress: DeliveryAddresses;
        if(delivery_address_id){
            deliveryAddress =  await this.addressRepository.findOneById(delivery_address_id)
        }else if(delivery_address){
            deliveryAddress = await this.addressRepository.create(delivery_address)
        }
        return await this.dataSource.transaction(async(manager)=>{
            const order = await manager.findOne(Orders,{where:{order_id:id}, relations: ['order_products', 'order_products.product']})
            if(!order) throw new NotFoundException('Заказ не найден')
            if(dto.products){
                for (const op of order.order_products) {
                    op.product.stock_quantity += op.quantity
                }
                await manager.delete(OrderProducts,{order: {order_id:id}})
                const productIds = dto.products.map((p)=>p.product_id)
                const products = await manager.findBy(Products, {product_id: In(productIds)})
                if(products.length !== productIds.length) throw new NotFoundException('Некоторых товаров не существует');
                const productMap = new Map(products.map((p)=>[p.product_id, p]));
                const orderProducts: OrderProducts[] = [];

                for(const item of dto.products){
                    const product = productMap.get(item.product_id)
                    if(!product || !product.is_active) throw new BadRequestException(`Товар с id ${item.product_id} недоступен`);
                    if(product.stock_quantity < item.quantity) throw new BadRequestException(`Недостаточно товара "${product.name}" на складе`);
                    
                    const total = +(product.price_per_unit * item.quantity).toFixed(2);
                    const orderProduct = manager.create(OrderProducts,{
                        product,
                        quantity:item.quantity,
                        price_per_unit:product.price_per_unit,
                        total_price:total,
                    });
                    orderProducts.push(orderProduct);
                    
                    product.stock_quantity -= item.quantity
                }
                orderProducts.forEach((op) => (op.order = order))
                await manager.save(orderProducts)
                await manager.save(products)

            } 
            if(dto.recipient_name) order.recipient_name = dto.recipient_name;
            if(dto.customer_comment) order.customer_comment = dto.customer_comment
            if(dto.recipient_number) order.recipient_number = dto.recipient_number            
            if(dto.delivery_date) order.delivery_date = dto.delivery_date
            if(dto.payment_method) order.payment_method = dto.payment_method
            await manager.save(order)
            return order
        })
    }
    async findOneById(id:number){
        const order = await this.ordersReposiroty.findOne({where: {order_id: id}})
        if(!order) throw new NotFoundException('Заказ не найден')
        return order
    }
    async delete(id: number){
        const result = await this.ordersReposiroty.delete(id)
        if(result.affected === 0) throw new NotFoundException('Заказ не найден')
        return {success: true, deletedId: id}
    }
}
