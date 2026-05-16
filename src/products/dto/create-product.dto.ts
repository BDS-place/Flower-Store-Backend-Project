import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name!:string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price_per_unit!:number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description!:string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock_quantity!:number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    unit!:string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    product_type_id!:number
}