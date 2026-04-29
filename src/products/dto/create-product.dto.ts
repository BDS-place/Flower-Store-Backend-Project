import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name!:string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    price_per_unit!:number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description!:string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    stock_quantity!:number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    unit!:string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    product_type_id!:number
}