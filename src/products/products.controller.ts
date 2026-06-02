import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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

    @ApiOperation({summary:'Создание новых тоаров'})
    @ApiResponse({status:200,description:'Создание нового товара'})
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @Post()
    create(@Body() createProductDto: CreateProductDto){
        return this.productsService.create(createProductDto)
    }

    @ApiOperation({summary:'Поиск всех товаров'})
    @ApiResponse({status:200,description:'Товары найдены'})
    @Public()
    @Get()
    findAll(
        @Query('sortBy') sortBy: string = 'created_at',
        @Query('order') order: 'ASC' | 'DESC' = 'DESC',
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit',new DefaultValuePipe(20),ParseIntPipe) limit: number,
        @Query('type') type?: number,
        @Query('search') search?: string,
    ){
        return this.productsService.findAll({sortBy, order, page, limit, type, search})
    }
    @ApiOperation({summary:'Поиск товара по id'})
    @ApiResponse({status:200,description:'Товар найден'})
    @Public()
    @Get(':id')
    findOneById(@Param('id', ParseIntPipe) id: number){
        return this.productsService.findOneById(id)
    }
    @ApiOperation({summary:'Изменение товара'})
    @ApiResponse({status:200, description:'Товар успешно изменен'})
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    productUpdate(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto){
        return this.productsService.productUpdate(id, updateProductDto)
    }

    @ApiOperation({summary:'Изменение количества товара'})
    @ApiResponse({status:200, description:'Количество успешно изменено'})
    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    stockUpdate(@Param('id', ParseIntPipe) id:number, @Body() updateStockDto: UpdateStockDto){
        return this.productsService.stockUpdate(id, updateStockDto)
    }

    @ApiOperation({summary:'Удаление товара по Id'})
    @ApiResponse({status:200, description:'Товар успешно удален'})
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    remove(@Param('id', ParseIntPipe) id: number){
        return this.productsService.remove(id)
    }

    @ApiOperation({summary:'Добавление изображения товара'})
    @ApiResponse({status:200, description:'Изображение успешно добавлено'})
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
