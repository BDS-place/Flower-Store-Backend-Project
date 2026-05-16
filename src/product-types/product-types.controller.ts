import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypesDto } from './dto/create-product-types.dto';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProductTypesDto } from './dto/update-product-types.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('product-types')
export class ProductTypesController {
    constructor(
        private readonly productTypesService: ProductTypesService
    ){}

    @ApiOperation({})
    @ApiResponse({})
    @Get()
    @Public()
    findAll(){
        return this.productTypesService.findAll()
    }

    @ApiOperation({})
    @ApiResponse({})
    @Public()
    @Get(':id')
    findOneById(@Param('id', ParseIntPipe) id: number){
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
    update(@Param('id', ParseIntPipe) id:number, @Body() dto:UpdateProductTypesDto) {
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
        return this.productTypesService.updateImage(id, url);
    }
}
