import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    ArrayMinSize, IsArray, IsDateString, IsInt, IsOptional,
    IsPhoneNumber, IsString, Min, ValidateIf, ValidateNested
} from "class-validator";
import { CreateDeliveryAddressDto } from "src/delivery-addresses/dto/create-delivery-addresses.dto";
import { OrderProductsDto } from "./order-products.dto";

export default class UpdateOrderDto {

    @ApiPropertyOptional({ description: 'ID существующего адреса', example: 5 })
    @IsOptional()
    @ValidateIf((o) => !o.delivery_address)
    @IsInt()
    @Min(1)
    delivery_address_id?: number;

    @ApiPropertyOptional({ description: 'Новый адрес доставки' })
    @IsOptional()
    @ValidateIf((o) => !o.delivery_address_id)
    @ValidateNested()
    @Type(() => CreateDeliveryAddressDto)
    delivery_address?: CreateDeliveryAddressDto;

    @ApiPropertyOptional({ description: 'Дата доставки', example: '2026-06-01' })
    @IsOptional()
    @IsDateString()
    delivery_date?: Date;

    @ApiPropertyOptional({ description: 'Имя получателя', example: 'Иван Иванов' })
    @IsOptional()
    @IsString()
    recipient_name?: string;

    @ApiPropertyOptional({ description: 'Телефон получателя', example: '+74959998877' })
    @IsOptional()
    @IsPhoneNumber('RU')
    recipient_number?: string;

    @ApiPropertyOptional({ description: 'Комментарий к заказу' })
    @IsOptional()
    @IsString()
    customer_comment?: string;

    @ApiPropertyOptional({ description: 'Способ оплаты', example: 'card' })
    @IsOptional()
    @IsString()
    payment_method?: string;

    @ApiPropertyOptional({ description: 'Список товаров' })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderProductsDto)
    products?: OrderProductsDto[];
}