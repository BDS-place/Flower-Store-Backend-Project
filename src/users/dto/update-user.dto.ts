import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsPhoneNumber, IsDateString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({description:'Новая почта',example:'example@index.com'})
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({description:'Новое имя',example:'Петр'})
  @IsOptional()
  @IsString()
  @MinLength(2)
  first_name?: string;

  @ApiPropertyOptional({description:'Новая фамилия',example:'Иванов'})
  @IsOptional()
  @IsString()
  @MinLength(2)
  last_name?: string;

  @ApiPropertyOptional({description:'Новый номер телефона',example:'+74959996677'})
  @IsOptional()
  @IsPhoneNumber('RU')
  phone_number?: string;

  @ApiPropertyOptional({description:'Новое день рождение',example:'02-04-2026'})
  @IsOptional()
  @IsDateString()
  birthday?: string; 
}