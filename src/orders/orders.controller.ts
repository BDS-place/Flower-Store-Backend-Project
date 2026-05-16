import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import CreateOrderDto from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import UpdateOrderDto from './dto/updatre-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService:OrdersService
    ){}
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOneById(@Param('id', ParseIntPipe) id: number){
        this.ordersService.findOneById(id)
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Req() req, @Body() dto: CreateOrderDto){
        const userId = req.user.id
        return this.ordersService.create(userId, dto)
    }
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto){
        this.ordersService.update(id, dto)
    }
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete (@Param('id', ParseIntPipe) id: number){
        return this.ordersService.delete(id)
    }
}
