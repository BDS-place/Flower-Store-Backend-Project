import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import CreateOrderDto from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService:OrdersService
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req, @Body() dto: CreateOrderDto){
        const userId = req.user.id
        return this.ordersService.create(userId, dto)
    }
}
