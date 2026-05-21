import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, ParseIntPipe, Patch, Post, Req, UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Найти свой профиль (требуется JWT)' })
  @ApiResponse({status:200, description:'Пользователь найден'})
  @ApiBearerAuth()  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {

    return this.usersService.findById(req.user.id);
  }


  @ApiOperation({ summary: 'Создание пользователя (регистрация)' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @Post('create')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Обновить свой профиль (требуется JWT)' })
  @ApiResponse({status:200, description:'Пользователь успешно изменен'})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me/profile')
  updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.id;
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Сменить пароль (требуется JWT)' })
  @ApiResponse({status:200, description:'Пароль успешно изменен'})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    const id = req.user.id;
    return this.usersService.changePassword(id, changePasswordDto);
  }


  @ApiOperation({ summary: 'Удалить пользователя по id (требуется JWT)' })
  @ApiResponse({status:200, description:'Пользователь успешно удален'})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}