import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypesDto } from './dto/create-product-types.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProductTypesDto } from './dto/update-product-types.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product-types')
export class ProductTypesController {
    constructor(
        private readonly productTypesService: ProductTypesService
    ){}

    @ApiOperation({})
    @ApiResponse({})
    @Get()
    findAll(){
        return this.productTypesService.findAll()
    }

    @ApiOperation({})
    @ApiResponse({})
    @Get(':id')
    findOneById(@Param('id') id: number){
        return this.productTypesService.findOneById(id);
    }

    @ApiOperation({})
    @ApiResponse({})
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @Post()
    create(@Body() dto:CreateProductTypesDto){
        return this.productTypesService.create(dto);
    }

    @ApiOperation({})
    @ApiResponse({})
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @Patch(':id')
    update(@Param('id') id:number, @Body() dto:UpdateProductTypesDto) {
        return this.productTypesService.update(id,dto);
    }
    
    @ApiOperation({})
    @ApiResponse({})
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @Delete(':id')
    delete(@Param('id') id: number ){
        return this.productTypesService.delete(id)
    }
}
