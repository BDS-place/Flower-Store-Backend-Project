import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Min, MinDate, ValidateIf, ValidateNested } from "class-validator";
import { CreateDeliveryAddressDto } from "src/delivery-addresses/dto/create-delivery-addresses.dto";
import { OrderProductsDto } from "./order-products.dto";

export default class CreateOrderDto{

    @ApiPropertyOptional({ description: 'ID существующего адреса', example: 5 })
    @ValidateIf((o) => !o.delivery_address)
    @IsInt()
    @Min(1)
    delivery_address_id?: number;

    @ValidateIf((o)=>!o.delivery_address_id)
    @ValidateNested()
    @Type(() => CreateDeliveryAddressDto)
    delivery_address?: CreateDeliveryAddressDto


    @IsNotEmpty()
    @IsDateString()
    @MinDate(new Date())
    delivery_date!:Date

    @IsNotEmpty()
    @IsString()
    recipient_name!:string

    @IsNotEmpty()
    @IsPhoneNumber('RU')
    recipient_number!:string

    @IsOptional()
    @IsString()
    customer_comment?:string

    @IsString() 
    @IsNotEmpty() 
    payment_method!: string;

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each:true})
    @Type(()=>OrderProductsDto)
    products!:OrderProductsDto[]

}