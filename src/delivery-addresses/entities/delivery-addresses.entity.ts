import { ApiProperty } from "@nestjs/swagger";
import { Orders } from "src/orders/entities/orders.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('delivery_addresses')
export class DeliveryAddresses{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    delivery_address_id:number

    @ApiProperty()
    @Column()
    city!:string

    @ApiProperty()
    @Column()
    street!:string

    @ApiProperty()
    @Column()
    house!:string

    @ApiProperty()
    @Column()
    apartment_number!:string

    @ApiProperty()
    @CreateDateColumn()
    created_at!:Date

    @ApiProperty()
    @UpdateDateColumn()
    updated_at!:Date

    @ApiProperty()
    @OneToMany(()=>Orders, (order)=>order.delivery_address_id)
    order!:Orders[]
}