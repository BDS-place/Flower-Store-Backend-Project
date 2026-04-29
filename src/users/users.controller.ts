import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Req, UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Найти свой профиль (требуется JWT)' })
  @ApiBearerAuth()  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {

    return this.usersService.findById(req.user.id);
  }


  @ApiOperation({ summary: 'Создание пользователя (регистрация)' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Обновить свой профиль' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me/profile')
  updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.id;
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Сменить пароль' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    const id = req.user.id;
    return this.usersService.changePassword(id, changePasswordDto);
  }


  @ApiOperation({ summary: 'Удалить пользователя по id (требуется JWT)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}