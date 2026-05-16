import { Orders } from "src/orders/entities/orders.entity";
import { Products } from "src/products/entities/products.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('order_products')
export default class OrderProducts{
    @PrimaryGeneratedColumn()
    order_product_id!:number

    @ManyToOne(()=> Orders, (order) => order.order_products, {onDelete:'CASCADE'})
    @JoinColumn({name:'order_id'})
    order!:Orders

    @ManyToOne(()=> Products, (product)=> product.order_products,{onDelete:'RESTRICT'})
    @JoinColumn({name:'product_id'})
    product!:Products

    @Column()
    quantity!:number

    @Column()
    price_per_unit!:number

    @Column()
    total_price!:number
}
