import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { OrdersModule } from './orders/orders.module';


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
  }), UsersModule, ProductsModule, ProductTypesModule, AuthModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass:RolesGuard,
  }],
})
export class AppModule {}
