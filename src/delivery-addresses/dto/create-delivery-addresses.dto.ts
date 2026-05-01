import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDeliveryAddressDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    city!: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    street!:string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    house!:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    apartment_number?:string
}