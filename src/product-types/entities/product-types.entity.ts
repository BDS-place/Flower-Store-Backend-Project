import { ApiProperty } from "@nestjs/swagger";
import { Products } from "src/products/entities/products.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('product_types')
export class ProductTypes{

    @ApiProperty({description:'ID типа товара', example:1})
    @PrimaryGeneratedColumn()
    product_type_id!:number

    @ApiProperty({description:'Название типа товара', example:'Букеты'})
    @Column()
    name!:string

    @ApiProperty({description:'Понятный URL', example:'buket'})
    @Column()
    slug!:string

    @ApiProperty({description:'URL изобаржения типа товара', example:'/uploads/image.jpeg'})
    @Column()
    icon_url!:string

    @ApiProperty({description:'Описание типа товара', example:'Букеты для подарка'})
    @Column()
    description!:string

    @ApiProperty({description:'Дата создания типа товара',example:'2024-01-15T10:30:00.000Z'})
    @CreateDateColumn()
    created_at!:Date

    @ApiProperty({description:'Дата обновления типа товара',example:'2024-02-15T10:30:00.000Z'})
    @UpdateDateColumn()
    updated_at!:Date

    @OneToMany(() => Products, (product) => product.productType)
    products!: Products[]
}