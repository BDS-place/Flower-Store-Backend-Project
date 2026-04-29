import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        const expiresIn = config.get<string>('JWT_EXPIRES_IN');
        if (!secret || !expiresIn) {
          throw new Error('JWT_SECRET and JWT_EXPIRES_IN must be defined');
        }
        // Приводим к допустимому типу
        const signOptions: { expiresIn: number | ms.StringValue } = {
          expiresIn: expiresIn as ms.StringValue,
        };
        return {
          secret,
          signOptions,
        };
      },
    }),
  ],
  providers: [JwtStrategy,
    AuthService,
    {
      provide: 'JWT_REFRESH_SERVICE',
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_REFRESH_SECRET');
        const expiresIn = config.get<string>('JWT_REFRESH_EXPIRES_IN');
        if (!secret || !expiresIn) {
          throw new Error('JWT_REFRESH_SECRET and JWT_REFRESH_EXPIRES_IN must be defined');
        }
        return new JwtService({
          secret,
          signOptions: {
            expiresIn: expiresIn as ms.StringValue,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}