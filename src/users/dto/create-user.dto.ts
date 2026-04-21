import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength} from 'class-validator'
export class CreateUserDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email!:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password!:string

    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber('RU')
    phone_number!: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    first_name!:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    birthday?:string
}