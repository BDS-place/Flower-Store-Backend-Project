import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength} from 'class-validator'
export class CreateUserDto{
    @ApiProperty({description:'почта',example:'example@index.com'})
    @IsNotEmpty()
    @IsEmail()
    email!:string

    @ApiProperty({description:'пароль',example:'18g7943uhif3g4rv/423gh9u'})
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password!:string

    @ApiProperty({description:'Номер телефона',example:'+74959998877'})
    @IsNotEmpty()
    @IsPhoneNumber('RU')
    phone_number!: string

    @ApiProperty({description:'Имя',example:'Иван'})
    @IsNotEmpty()
    @IsString()
    first_name!:string

    @ApiProperty({ description: 'Фамилия', example: 'Петров' })
    @IsString()
    last_name!: string;

    @ApiPropertyOptional({description:'День рождения',example:'02-03-2026'})
    @IsOptional()
    @IsString()
    birthday?:string
}