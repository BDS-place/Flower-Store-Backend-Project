import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class UpdateStockDto{
    @ApiProperty({ description: 'Новое количество на складе', example: 42 })
    @IsInt()
    @Min(0)
    stock_quantity!:number
}