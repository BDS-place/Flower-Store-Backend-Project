import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type:'mysql',
    host:'localhost',
    port:3306,
    username:'root',
    password:process.env.DB_PASSWORD,
    database:'flower_store_db',
    entities:[__dirname+'/**/*/.entity{.ts,.js}'],
    synchronize:false
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
