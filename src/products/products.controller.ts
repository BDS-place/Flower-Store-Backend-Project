import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}

    @ApiOperation({summary:''})
    @ApiResponse({status:200,description:''})
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @Post()
    create(@Body() createProductDto: CreateProductDto){
        return this.productsService.create(createProductDto)
    }

    @ApiOperation({summary:''})
    @ApiResponse({status:200,description:''})
    @Get()
    findAll(
        @Query('sortBy') sortBy: string = 'created_at',
        @Query('order') order: 'ASC' | 'DESC' = 'DESC',
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit',ParseIntPipe) limit: number = 20,
        @Query('type') type?: number,
        @Query('search') search?: string,
    ){
        return this.productsService.findAll({sortBy, order, page, limit, type, search})
    }
    @ApiOperation({summary:''})
    @ApiResponse({status:200,description:''})
    @Get(':id')
    findOneById(@Param('id') id: number){
        return this.productsService.findOneById(id)
    }
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    productUpdate(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto){
        return this.productsService.productUpdate(id, updateProductDto)
    }

    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    stockUpdate(@Param('id') id:number, @Body() updateStockDto: UpdateStockDto){
        return this.productsService.stockUpdate(id, updateStockDto)
    }
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    remove(@Param('id') id: number){
        return this.productsService.remove(id)
    }
}
