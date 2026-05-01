import { ApiProperty } from "@nestjs/swagger";
import { DeliveryAddresses } from "src/delivery-addresses/entities/delivery-addresses.entity";
import { Users } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Orders{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    order_id:number

    @ApiProperty()
    @ManyToOne(()=>Users, (user)=>user.orders)
    @JoinColumn({name:'user_id'})
    user!: Users

    @ApiProperty()
    @Column()
    order_number!:number

    @ApiProperty()
    @Column()
    delivery_date!:Date

    @ApiProperty()
    @Column()
    recipient_name:string

    @ApiProperty()
    @Column()
    recipient_number:string

    @ApiProperty()
    @Column()
    customer_comment:string

    @ApiProperty()
    @ManyToOne(()=> DeliveryAddresses, (address)=>address.order)
    @JoinColumn({name:'delivery_address_id'})
    delivery_address_id!:DeliveryAddresses

    @ApiProperty()
    @Column()
    payment_method!:string

    @ApiProperty()
    @Column({nullable:true})
    is_paid!:boolean

    @ApiProperty()
    @Column()
    order_status:string

    @ApiProperty()
    @CreateDateColumn()
    created_at:Date

    @ApiProperty()
    @UpdateDateColumn()
    update_at:Date
}