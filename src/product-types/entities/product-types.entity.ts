import { ApiProperty } from "@nestjs/swagger";
import { Products } from "src/products/entities/products.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('product_types')
export class ProductTypes{

    @ApiProperty()
    @PrimaryGeneratedColumn()
    product_type_id!:number

    @ApiProperty()
    @Column()
    name!:string

    @ApiProperty()
    @Column()
    slug!:string

    @ApiProperty()
    @Column()
    icon_url!:string

    @ApiProperty()
    @Column()
    description!:string

    @ApiProperty()
    @CreateDateColumn()
    created_at:Date

    @ApiProperty()
    @UpdateDateColumn()
    updated_at:Date

    @OneToMany(() => Products, (product) => product.productType)
    products: Products[]
}