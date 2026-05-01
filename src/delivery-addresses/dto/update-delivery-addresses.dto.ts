import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateDeliveryAddressesDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    city?:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    street?:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    house?:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    apartment_number?:string
}