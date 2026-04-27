import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory: (config: ConfigService) =>({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:config.get<string>('DB_PROFILE'),
    password:config.get<string>('DB_PASSWORD'),
    database:'flower_store_db',
    entities:[__dirname+'/**/*.entity{.ts,.js}'],
    synchronize:false
    })
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
