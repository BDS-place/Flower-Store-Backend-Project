import { ApiProperty } from "@nestjs/swagger";
import OrderProducts from "src/order_products/entities/order-products.entity";
import { ProductTypes } from "src/product-types/entities/product-types.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Products{
    @ApiProperty({description:'Id товара', example:1})
    @PrimaryGeneratedColumn()
    product_id!:number

    @ApiProperty({description:'Название товара', example:'Белая роза'})
    @Column()
    name!:string

    @ApiProperty({description:'Понятные URL адреса', example:'White_rose'})
    @Column()
    slug!:string

    @ApiProperty({description:'Цена за единицу', example:50})
    @Column()
    price_per_unit!:number

    @ApiProperty({description:'Описание товара', example:'Белая роза для сада'})
    @Column()
    description!:string

    @ApiProperty({description:'Ссылка на изображение (генерируется автоматически)', example:'uploads/image.jpeg'})
    @Column({nullable:true,default: null})
    image_url!:string

    @ApiProperty({description:'Количество товара в наличии', example:5})
    @Column()
    stock_quantity!:number

    @ApiProperty({description:'Единица измерения', example:'букет'})
    @Column()
    unit!:string

    @ApiProperty({description:'Активен ли товар', example:true})
    @Column({default:true})
    is_active!:boolean

    @ApiProperty({description:'Дата создания товара',example:'2024-01-15T10:30:00.000Z'})
    @CreateDateColumn()
    created_at!:Date

    @ApiProperty({description:'Дата обновления товара',example:'2024-02-15T10:30:00.000Z'})
    @UpdateDateColumn()
    updated_at!:Date

    @ApiProperty({type:()=>ProductTypes, description:'Id типа товара', example:1})
    @ManyToOne(()=>ProductTypes, (pt)=>pt.products)
    @JoinColumn({name:'product_type_id'})
    productType!: ProductTypes

    @OneToMany(()=> OrderProducts, (order)=> order.product)
    order_products!:OrderProducts[]
}