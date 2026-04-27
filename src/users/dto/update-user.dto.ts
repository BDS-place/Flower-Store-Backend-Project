import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsPhoneNumber, IsDateString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({description:'',example:''})
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({description:'',example:''})
  @IsOptional()
  @IsString()
  @MinLength(2)
  first_name?: string;

  @ApiPropertyOptional({description:'',example:''})
  @IsOptional()
  @IsString()
  @MinLength(2)
  last_name?: string;

  @ApiPropertyOptional({description:'',example:''})
  @IsOptional()
  @IsPhoneNumber('RU')
  phone_number?: string;

  @ApiPropertyOptional({description:'',example:''})
  @IsOptional()
  @IsDateString()
  birthday?: string; 
}