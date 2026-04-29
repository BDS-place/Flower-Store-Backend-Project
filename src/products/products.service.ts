import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import slugify from 'slugify'
import { ProductTypesService } from 'src/product-types/product-types.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        private readonly productTypesRepository: ProductTypesService,
    ){}

    async create(createProductDto:CreateProductDto):Promise<Products>{
        const {name,product_type_id, ...productData} = createProductDto;
        const slug = slugify(name,{lower:true,strict:true, trim:true});
        const existing = await this.productsRepository.findOne({where:[{name},{slug}]});
        if (existing) throw new ConflictException('Такой товар уже есть');
        const productType = await this.productTypesRepository.findOneById(product_type_id);
        const product = this.productsRepository.create({...productData, name, slug, productType})
        return this.productsRepository.save(product)
    }

    async findAll(options:{
        sortBy: string;
        order: 'ASC' | 'DESC';
        page: number;
        limit: number;
        type?: number;
        search?: string;
    }): Promise<{data: Products[]; total: number; page: number; limit: number}>{
        const { sortBy, order, page, limit, type, search } = options;

        const ALLOWED_SORT_FIELDS = [
        'name',
        'price_per_unit',
        'stock_quantity',
        'created_at',
        'updated_at',
        ];


        const sortBySafe = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'created_at';
        const orderSafe = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const query = this.productsRepository.createQueryBuilder('product')
        .leftJoinAndSelect('product.productType', 'productType');

        if(search){
            query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
        }
        if(type){
            query.andWhere('product.product_type_id = :typeId', { type });
        }

        query.orderBy(`product.${sortBySafe}`, orderSafe);
        query.skip((page - 1) * limit).take(limit);
        const [data, total] = await query.getManyAndCount();

        return {data, total, page, limit};
    }

    async findOneById(id:number){
        const product = await this.productsRepository.findOne({where:{product_id:id}, relations:['productType']});
        if(!product) throw new NotFoundException('Продукт не найден');
        return product
    }

    async productUpdate(id:number, dto:UpdateProductDto){   

        const product = await this.productsRepository.findOneBy({product_id:id});
        if(!product) throw new NotFoundException('Товар не найден');


        if(dto.name && dto.name !== product.name){
            const existing = await this.productsRepository.findOneBy({name: dto.name})
            if(existing) throw new ConflictException('Такой товар уже есть');
            
            const newSlug = slugify(dto.name,{lower: true, strict: true, trim: true });
            const slugExists = await this.productsRepository.findOneBy({slug:newSlug});
            if (slugExists && slugExists.product_id !== id) {

            product.slug = newSlug + '-' + id;
            } else {
            product.slug = newSlug;
            }
            product.name = dto.name
        }
        if(dto.product_type_id !== undefined){
            const productType = await this.productTypesRepository.findOneById(dto.product_type_id)
            product.productType = productType
        }
        if (dto.price_per_unit !== undefined) product.price_per_unit = dto.price_per_unit;
        if (dto.description !== undefined) product.description = dto.description;
        if (dto.is_active !== undefined) product.is_active = dto.is_active;
        return this.productsRepository.save(product)
    }

    async stockUpdate(id:number, dto: UpdateStockDto){
        const result = await this.productsRepository.update(
            { product_id: id },
            { stock_quantity: dto.stock_quantity }
        );
        if (result.affected === 0) throw new NotFoundException('Товар не найден');
    }
    async remove(id: number) {
    const result = await this.productsRepository.update(
        { product_id: id },
        { is_active: false }
    );
    if (result.affected === 0) throw new NotFoundException('Товар не найден');
    return { success: true, deletedId: id };
    }
}
