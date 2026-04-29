import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @ApiOperation({summary:'Найти пользователя по id'})
    @ApiResponse({status:200, description:'Пользователь найден'})
    @ApiResponse({status:404, description:'Пользователь не найден'})
    @Get('me')
    find(@Param('id') id:number){
        return this.usersService.find(id)
    }
    @ApiOperation({summary:'Создание пользователя'})
    @ApiResponse({status:201, description:'Пользователь успешно создан'})
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: CreateUserDto){
        return this.usersService.create(createUserDto)
    }
    @ApiOperation({summary:'Обновление пользователя'})
    @ApiResponse({})
    @Patch('me/profile')
    updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto){
        const id = req.user.id;
        return this.usersService.updateProfile(id, updateUserDto)
    }
    @ApiOperation({summary:'Обновление пароля пользователя'})
    @ApiResponse({})
    @Patch('me/password')
    changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto){
        const id = req.user.id
        return this.usersService.changePassword(id, changePasswordDto)
    }
    @ApiOperation({summary:'Удаление пользователя по id'})
    @ApiResponse({status:200, description:'Успешно удалено'})
    @ApiResponse({status:404, description:'Пользователь не найден'})
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.usersService.delete(id)
    }
}
