import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto{
    @ApiProperty({description:'Текущий пароль',example:'18g7943uhif3g4rv/423gh9u'})
    @IsString()
    @IsNotEmpty()
    old_password!: string

    @ApiProperty({description:'Новый пароль',example:'1832hojnvswdafchif3g4rv/423gh9u'})
    @IsString()
    @IsNotEmpty()
    new_password!: string
}