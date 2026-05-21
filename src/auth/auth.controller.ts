import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import type { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary:'Вход в аккаунт'})
  @ApiResponse({status:HttpStatus.OK, description:'Успешный вход в аккаунт'})
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    const { accessToken, refreshToken, user: userData } = await this.authService.login(user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, 
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return { user: userData };
  }

  @ApiOperation({ summary: 'Обновление токенов по refresh-токену' })
  @ApiResponse({status:HttpStatus.OK, description:'Обновление токенов успешно'})
  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refresh_token'];
    const { access_token, refresh_token } = await this.authService.refreshToken(refreshToken);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { success: true };
  }

  @ApiOperation({summary:'Выход из аккаунта'})
  @ApiResponse({status:HttpStatus.NO_CONTENT, description:"Успешный выход из аккаунта"})
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.id);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}