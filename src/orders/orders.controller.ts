import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import CreateOrderDto from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import UpdateOrderDto from './dto/updatre-order.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService:OrdersService
    ){}

    @ApiOperation({summary:'Поиск заказа по ID'})
    @ApiResponse({status:200, description:'Заказ успешно найден'})
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOneById(@Param('id', ParseIntPipe) id: number){
        this.ordersService.findOneById(id)
    }
    @ApiOperation({summary:'Создание заказа'})
    @ApiResponse({status:HttpStatus.CREATED, description:'Заказ успешно создан'})
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Req() req, @Body() dto: CreateOrderDto){
        const userId = req.user.id
        return this.ordersService.create(userId, dto)
    }
    @ApiOperation({summary:'Изменение заказа'})
    @ApiResponse({status:200, description:'Заказ успешно изменен'})
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto){
        this.ordersService.update(id, dto)
    }
    @ApiOperation({summary:'Удаление заказа'})
    @ApiResponse({status:200, description:'Заказ успешно удален'})
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete (@Param('id', ParseIntPipe) id: number){
        return this.ordersService.delete(id)
    }
}
