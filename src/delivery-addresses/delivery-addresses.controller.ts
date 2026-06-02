import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { DeliveryAddressesService } from './delivery-addresses.service';
import { CreateDeliveryAddressDto } from './dto/create-delivery-addresses.dto';
import { UpdateDeliveryAddressesDto } from './dto/update-delivery-addresses.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('delivery-addresses')
export class DeliveryAddressesController {
    constructor(
        private readonly deliveryAddressesService:DeliveryAddressesService
    ){}

    @ApiOperation({summary:'Создание адреса'})
    @ApiResponse({status:HttpStatus.CREATED, description:'Адрес успешно создан'})
    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateDeliveryAddressDto){
        return this.deliveryAddressesService.create(dto);
    }
    
    @ApiOperation({summary:'Удаление адреса по id'})
    @ApiResponse({status:200,description:'Адрес успешно удален'})
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number){
        return this.deliveryAddressesService.delete(id);
    }

    @ApiOperation({summary:'Поиск всех адресов'})
    @ApiResponse({status:200,description:'Адреса найдены'})    
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(){
        return this.deliveryAddressesService.findAll();
    }

    @ApiOperation({summary:'Поиск адреса по id'})
    @ApiResponse({status:200,description:'Адрес найден'})   
    @UseGuards(JwtAuthGuard) 
    @Get(':id')
    findOneById(@Param('id', ParseIntPipe) id: number){
        return this.deliveryAddressesService.findOneById(id);
    }

    @ApiOperation({summary:'Изменение адреса'})
    @ApiResponse({status:200,description:'Адрес успешно изменен'}) 
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id:number, @Body() dto: UpdateDeliveryAddressesDto){
        return this.deliveryAddressesService.update(id,dto);
    }
}
