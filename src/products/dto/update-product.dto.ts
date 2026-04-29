import {ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto{

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber({maxDecimalPlaces: 2})
    price_per_unit?:number

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_active?:boolean

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    product_type_id?:number
}