import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('JWT_REFRESH_SERVICE') private readonly refreshTokenService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Неверный email или пароль');
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Неверный email или пароль');
    const { password_hash, refresh_token_hash, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.user_id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.refreshTokenService.sign({ sub: user.user_id });
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshTokenHash(user.user_id, hash);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: { id: user.user_id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role },
    };
  }

  async refreshToken(token: string) {
    let payload: any;
    try { payload = this.refreshTokenService.verify(token); }
    catch { throw new UnauthorizedException('Невалидный refresh token'); }
    const user = await this.usersService.findByIdWithRefreshToken(payload.sub);
    if (!user || !user.refresh_token_hash) throw new UnauthorizedException('Доступ запрещён');
    const match = await bcrypt.compare(token, user.refresh_token_hash);
    if (!match) throw new UnauthorizedException('Refresh token не совпадает');
    const newAccess = this.jwtService.sign({ sub: user.user_id, email: user.email, role: user.role });
    const newRefresh = this.refreshTokenService.sign({ sub: user.user_id });
    const newHash = await bcrypt.hash(newRefresh, 10);
    await this.usersService.updateRefreshTokenHash(user.user_id, newHash);
    return { access_token: newAccess, refresh_token: newRefresh };
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }
}