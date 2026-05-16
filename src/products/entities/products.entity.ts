import { ApiProperty } from "@nestjs/swagger";
import OrderProducts from "src/order_products/entities/order-products.entity";
import { ProductTypes } from "src/product-types/entities/product-types.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Products{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    product_id!:number

    @ApiProperty()
    @Column()
    name!:string

    @ApiProperty()
    @Column()
    slug!:string

    @ApiProperty()
    @Column()
    price_per_unit!:number

    @ApiProperty()
    @Column()
    description!:string
    @ApiProperty()
    @Column({nullable:true,default: null})
    image_url!:string

    @ApiProperty()
    @Column()
    stock_quantity!:number

    @ApiProperty()
    @Column()
    unit!:string

    @ApiProperty()
    @Column({default:true})
    is_active!:boolean

    @ApiProperty()
    @CreateDateColumn()
    created_at!:Date

    @ApiProperty()
    @UpdateDateColumn()
    updated_at!:Date

    @ApiProperty({type:()=>ProductTypes})
    @ManyToOne(()=>ProductTypes, (pt)=>pt.products)
    @JoinColumn({name:'product_type_id'})
    productType!: ProductTypes

    @OneToMany(()=> OrderProducts, (order)=> order.product)
    order_products!:OrderProducts[]
}