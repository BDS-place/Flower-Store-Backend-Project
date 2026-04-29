import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTypes } from './entities/product-types.entity';
import { CreateProductTypesDto } from './dto/create-product-types.dto';
import slugify from 'slugify'
import { UpdateProductTypesDto } from './dto/update-product-types.dto';
@Injectable()
export class ProductTypesService {
    constructor(
        @InjectRepository(ProductTypes)
        private productTypesRepository: Repository<ProductTypes>
    ){}

    async findOneById(id:number):Promise<ProductTypes>{
        const type = await this.productTypesRepository.findOneBy({product_type_id:id});
        if(!type) throw new NotFoundException('Тип продукта не найден');
        return type;
    }
    async findAll(){
        return this.productTypesRepository.find();
    }
    async create(dto: CreateProductTypesDto){
        const {name, ...data} = dto
        const slug = slugify(name,{lower:true,strict:true, trim:true});
        const existing = await this.productTypesRepository.findOne({where:[{name},{slug}]})
        if(existing) throw new ConflictException('Такой тип товара уже существует');
        const productType = this.productTypesRepository.create({name,slug,...data});
        return this.productTypesRepository.save(productType)
    }
    async delete(id: number){
        const result = await this.productTypesRepository.delete({product_type_id:id})
        if(result.affected === 0) throw new NotFoundException('Тип товара не найден');
        return {success: true, deletedId: id}
    }
    async update(id:number,dto: UpdateProductTypesDto){
        const type = await this.productTypesRepository.findOneBy({product_type_id:id})
        if(!type) throw new NotFoundException('Тип товара не найден');

        if(dto.name && dto.name !== type.name){
            const existing = await this.productTypesRepository.findOneBy({name:dto.name})
            if(existing) throw new ConflictException('Такой тип товара уже существует');

            const newSlug = slugify(dto.name,{lower: true, strict: true, trim: true });
            const slugExists = await this.productTypesRepository.findOneBy({slug:newSlug});
            if(slugExists && slugExists.product_type_id !== id){
                type.slug= newSlug + '-' + id;
            }else{
                type.slug = newSlug
            }
            type.name = dto.name;
        }
        if(dto.description !== undefined) type.description = dto.description
        return this.productTypesRepository.save(type)
    }
}
