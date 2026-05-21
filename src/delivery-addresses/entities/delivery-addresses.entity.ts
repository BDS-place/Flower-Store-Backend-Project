import { ApiProperty } from "@nestjs/swagger";
import { Orders } from "src/orders/entities/orders.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('delivery_addresses')
export class DeliveryAddresses{
    @ApiProperty({description:'Id Адреса', example:1})
    @PrimaryGeneratedColumn()
    delivery_address_id!:number

    @ApiProperty({description:'Город', example:'Москва'})
    @Column()
    city!:string

    @ApiProperty({description:'Улица', example:'Руставели'})
    @Column()
    street!:string

    @ApiProperty({description:'Номер дома', example:'21А'})
    @Column()
    house!:string

    @ApiProperty({description:'Номер квартиры', example:'105'})
    @Column()
    apartment_number!:string

    @ApiProperty({description:'Дата создания адреса',example:'2024-01-15T10:30:00.000Z'})
    @CreateDateColumn()
    created_at!:Date

    @ApiProperty({description:'Дата обновления адреса',example:'2024-02-15T10:30:00.000Z'})
    @UpdateDateColumn()
    updated_at!:Date


    @OneToMany(()=>Orders, (order)=>order.delivery_address_id)
    order!:Orders[]
}