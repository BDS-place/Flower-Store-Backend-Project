import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto{
    @ApiProperty({description:'Название товара', example:'Тюльпан'})
    @IsNotEmpty()
    @IsString()
    name!:string

    @ApiProperty({description:'Цена за единицу товара', example:30})
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price_per_unit!:number

    @ApiProperty({description:'Описание товара', example:'Тюльпан для сада'})
    @IsNotEmpty()
    @IsString()
    description!:string

    @ApiProperty({description:'Количество на складе', example:42})
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock_quantity!:number

    @ApiProperty({description:'единица измерения', example:'букет'})
    @IsNotEmpty()
    @IsString()
    unit!:string

    @ApiProperty({description:'Id типа товара', example:1})
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    product_type_id!:number
}