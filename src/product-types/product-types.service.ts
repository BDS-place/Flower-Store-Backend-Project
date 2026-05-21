import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTypes } from './entities/product-types.entity';
import { CreateProductTypesDto } from './dto/create-product-types.dto';
import slugify from 'slugify'
import { UpdateProductTypesDto } from './dto/update-product-types.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const PRODUCT_TYPES_CACHE_KEY = 'product-types:all';

@Injectable()
export class ProductTypesService {
    constructor(
        @InjectRepository(ProductTypes)
        private productTypesRepository: Repository<ProductTypes>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}

    async findOneById(id:number):Promise<ProductTypes>{
        const type = await this.productTypesRepository.findOneBy({product_type_id:id});
        if(!type) throw new NotFoundException('Тип продукта не найден');
        return type;
    }
    async findAll(){
        const cached = await this.cacheManager.get<ProductTypes[]>(PRODUCT_TYPES_CACHE_KEY)
        if(cached) return cached
        const types = await this.productTypesRepository.find();
        await this.cacheManager.set(PRODUCT_TYPES_CACHE_KEY, types, 5*60*1000)
        return types
    }
    async create(dto: CreateProductTypesDto){
        const { name, ...data } = dto;
        const slug = slugify(name, { lower: true, strict: true, trim: true });
        const existing = await this.productTypesRepository.findOne({ where: [{ name }, { slug }] });
        if (existing) throw new ConflictException('Такой тип товара уже существует');
        const productType = this.productTypesRepository.create({ name, slug, ...data });
        const saved = await this.productTypesRepository.save(productType);
        await this.cacheManager.del(PRODUCT_TYPES_CACHE_KEY);
        return saved;
    }
    async delete(id: number){
        const result = await this.productTypesRepository.delete({product_type_id:id})
        if(result.affected === 0) throw new NotFoundException('Тип товара не найден');
        await this.cacheManager.del(PRODUCT_TYPES_CACHE_KEY);
        return {success: true, deletedId: id}
    }
    async update(id:number,dto: UpdateProductTypesDto){
        const type = await this.productTypesRepository.findOneBy({ product_type_id: id });
        if (!type) throw new NotFoundException('Тип товара не найден');
 
        if (dto.name && dto.name !== type.name) {
            const existing = await this.productTypesRepository.findOneBy({ name: dto.name });
            if (existing) throw new ConflictException('Такой тип товара уже существует');
            const newSlug = slugify(dto.name, { lower: true, strict: true, trim: true });
            const slugExists = await this.productTypesRepository.findOneBy({ slug: newSlug });
            type.slug = (slugExists && slugExists.product_type_id !== id) ? newSlug + '-' + id : newSlug;
            type.name = dto.name;
        }
        if (dto.description !== undefined) type.description = dto.description;
 
        const saved = await this.productTypesRepository.save(type);
        await this.cacheManager.del(PRODUCT_TYPES_CACHE_KEY);
        return saved;
    }
    async updateImage(id:number,imageUrl:string): Promise<ProductTypes>{
        const productType = await this.productTypesRepository.findOneBy({product_type_id:id});
        if(!productType)  throw new NotFoundException('Тип товара не найден');
        productType.icon_url = imageUrl;
        return this.productTypesRepository.save(productType)
    }
}
