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
import { DeliveryAddressesModule } from './delivery-addresses/delivery-addresses.module';
import { OrderProductsModule } from './order_products/order_products.module';
import { UploadsModule } from './uploads/uploads.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RedisCacheModule } from './redis-cache/redis-cache.module';



@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory: (config: ConfigService) =>({
    type:'mysql',
    host: "127.0.0.1",
    port:3306,
    username:config.get<string>('DB_PROFILE'),
    password:config.get<string>('DB_PASSWORD'),
    database:'flower_store_db',
    entities:[__dirname+'/**/*.entity{.ts,.js}'],
    synchronize:false
    })
  }), ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    serveRoot: '/uploads'
  }), UsersModule, ProductsModule, ProductTypesModule, AuthModule, OrdersModule, DeliveryAddressesModule, OrderProductsModule, UploadsModule, RedisCacheModule],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass:RolesGuard,
  }],
})
export class AppModule {}
