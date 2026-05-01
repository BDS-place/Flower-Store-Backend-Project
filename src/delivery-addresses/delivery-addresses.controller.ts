import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DeliveryAddressesService } from './delivery-addresses.service';
import { CreateDeliveryAddressDto } from './dto/create-delivery-addresses.dto';
import { UpdateDeliveryAddressesDto } from './dto/update-delivery-addresses.dto';

@Controller('delivery-addresses')
export class DeliveryAddressesController {
    constructor(
        private readonly deliveryAddressesService:DeliveryAddressesService
    ){}

    @Post()
    create(@Body() dto: CreateDeliveryAddressDto){
        return this.deliveryAddressesService.create(dto);
    }
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.deliveryAddressesService.delete(id);
    }
    @Get()
    findAll(){
        return this.deliveryAddressesService.findAll();
    }
    @Get(':id')
    findOneById(@Param('id') id: number){
        return this.deliveryAddressesService.findOneById(id);
    }
    @Patch(':id')
    update(@Param('id') id:number, @Body() dto: UpdateDeliveryAddressesDto){
        return this.deliveryAddressesService.update(id,dto);
    }
}
