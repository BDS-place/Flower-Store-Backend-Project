import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateProductTypesDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?:string
}