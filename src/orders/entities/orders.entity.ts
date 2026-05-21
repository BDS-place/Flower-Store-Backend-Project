import { ApiProperty } from "@nestjs/swagger";
import { DeliveryAddresses } from "src/delivery-addresses/entities/delivery-addresses.entity";
import OrderProducts from "src/order_products/entities/order-products.entity";
import { Users } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('orders')
export class Orders{
    @ApiProperty({description:'id заказа', example:1})
    @PrimaryGeneratedColumn()
    order_id!:number

    @ApiProperty({description:'Id пользователя', example:1})
    @ManyToOne(()=>Users, (user)=>user.orders)
    @JoinColumn({name:'user_id'})
    user!: Users

    @ApiProperty({description:'Номер заказа', example:'HR02052026173402'})
    @Column()
    order_number!:number

    @ApiProperty({description:'Дата доставки', example:'2026-05-15T10:30:00.000Z'})
    @Column()
    delivery_date!:Date

    @ApiProperty({description:'Имя получателя', example:'Иван'})
    @Column()
    recipient_name!:string

    @ApiProperty({description:'Номер получателя', example:'+74955553535'})
    @Column()
    recipient_number!:string

    @ApiProperty({description:'Комментарий пользователя', example:'Оставить у двери'})
    @Column()
    customer_comment!:string

    @ApiProperty({description:'id адреса доставки', example:1})
    @ManyToOne(()=> DeliveryAddresses, (address)=>address.order)
    @JoinColumn({name:'delivery_address_id'})
    delivery_address_id!:DeliveryAddresses

    @ApiProperty({description:'Способ оплаты', example:'карта'})
    @Column()
    payment_method!:string

    @ApiProperty({description:'Статус оплаты', example:false})
    @Column({nullable:true})
    is_paid!:boolean

    @ApiProperty({description:'Статус заказа', example:'Собирается'})
    @Column()
    order_status!:string

    @ApiProperty({description:'Дата создания заказа',example:'2024-01-15T10:30:00.000Z'})
    @CreateDateColumn()
    created_at!:Date

    @ApiProperty({description:'Дата обновления заказа',example:'2024-02-15T10:30:00.000Z'})
    @UpdateDateColumn()
    update_at!:Date

    @OneToMany(()=> OrderProducts, (p)=> p.order)
    order_products!: OrderProducts[]
}