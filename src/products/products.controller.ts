import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';

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
    @Public()
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
    @Public()
    @Get(':id')
    findOneById(@Param('id', ParseIntPipe) id: number){
        return this.productsService.findOneById(id)
    }
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    productUpdate(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto){
        return this.productsService.productUpdate(id, updateProductDto)
    }

    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    stockUpdate(@Param('id', ParseIntPipe) id:number, @Body() updateStockDto: UpdateStockDto){
        return this.productsService.stockUpdate(id, updateStockDto)
    }
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    remove(@Param('id', ParseIntPipe) id: number){
        return this.productsService.remove(id)
    }
    @Patch(':id/image')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    async uploadImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) throw new BadRequestException('Файл не передан');
        const url = `/uploads/${file.filename}`;
        return this.productsService.updateImage(id, url);
}
}
