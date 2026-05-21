import {ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto{

    @ApiPropertyOptional({description:'Новое название товара', example:'Роза обыкновенная'})
    @IsOptional()
    @IsString()
    name?:string

    @ApiPropertyOptional({description:'изменение цены за единицу товара', example:10})
    @IsOptional()
    @IsNumber({maxDecimalPlaces: 2})
    price_per_unit?:number

    @ApiPropertyOptional({description:'Изменение описания', example:'Роза обыкновнная для сада'})
    @IsOptional()
    @IsString()
    description?:string

    @ApiPropertyOptional({description:'Изменение активности товара', example:true})
    @IsOptional()
    @IsBoolean()
    is_active?:boolean

    @ApiPropertyOptional({description:'Изменение Id типа товара', example:1})
    @IsOptional()
    @IsNumber()
    product_type_id?:number
}