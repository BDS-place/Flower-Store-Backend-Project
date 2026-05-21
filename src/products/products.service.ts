import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import slugify from 'slugify';
import { ProductTypesService } from 'src/product-types/product-types.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        private readonly productTypesRepository: ProductTypesService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    private productCacheKey(id: number) {
        return `product:${id}`;
    }

    private async getProductsVersion(): Promise<number> {
        return (await this.cacheManager.get<number>('products:version')) ?? 0;
    }

    private async clearProductsListCache() {
        const version = await this.getProductsVersion();
        await this.cacheManager.set('products:version', version + 1, 24 * 60 * 60 * 1000);
    }

    async create(createProductDto: CreateProductDto): Promise<Products> {
        const { name, product_type_id, ...productData } = createProductDto;
        const slug = slugify(name, { lower: true, strict: true, trim: true });
        const existing = await this.productsRepository.findOne({ where: [{ name }, { slug }] });
        if (existing) throw new ConflictException('Такой товар уже есть');
        const productType = await this.productTypesRepository.findOneById(product_type_id);
        const product = this.productsRepository.create({ ...productData, name, slug, productType });
        const saved = await this.productsRepository.save(product);
        await this.clearProductsListCache();
        return saved;
    }

    async findAll(options: {
        sortBy: string;
        order: 'ASC' | 'DESC';
        page: number;
        limit: number;
        type?: number;
        search?: string;
    }): Promise<{ data: Products[]; total: number; page: number; limit: number }> {
        const { sortBy, order, page, limit, type, search } = options;

        const version = await this.getProductsVersion();
        const cacheKey = `products:${version}:${sortBy}:${order}:${page}:${limit}:${type ?? ''}:${search ?? ''}`;

        const cached = await this.cacheManager.get<{ data: Products[]; total: number; page: number; limit: number }>(cacheKey);
        if (cached) return cached;

        const ALLOWED_SORT_FIELDS = ['name', 'price_per_unit', 'stock_quantity', 'created_at', 'updated_at'];
        const sortBySafe = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'created_at';
        const orderSafe = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const query = this.productsRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.productType', 'productType');

        if (search) query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
        if (type) query.andWhere('productType.product_type_id = :typeId', { typeId: type });

        query.orderBy(`product.${sortBySafe}`, orderSafe);
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();
        const result = { data, total, page, limit };

        await this.cacheManager.set(cacheKey, result, 60 * 1000);
        return result;
    }

    async findOneById(id: number) {
        const cacheKey = this.productCacheKey(id);
        const cached = await this.cacheManager.get<Products>(cacheKey);
        if (cached) return cached;

        const product = await this.productsRepository.findOne({
            where: { product_id: id },
            relations: ['productType'],
        });
        if (!product) throw new NotFoundException('Продукт не найден');

        await this.cacheManager.set(cacheKey, product, 60 * 1000);
        return product;
    }

    async productUpdate(id: number, dto: UpdateProductDto) {
        const product = await this.productsRepository.findOneBy({ product_id: id });
        if (!product) throw new NotFoundException('Товар не найден');

        if (dto.name && dto.name !== product.name) {
            const existing = await this.productsRepository.findOneBy({ name: dto.name });
            if (existing) throw new ConflictException('Такой товар уже есть');
            const newSlug = slugify(dto.name, { lower: true, strict: true, trim: true });
            const slugExists = await this.productsRepository.findOneBy({ slug: newSlug });
            product.slug = (slugExists && slugExists.product_id !== id) ? newSlug + '-' + id : newSlug;
            product.name = dto.name;
        }
        if (dto.product_type_id !== undefined) {
            product.productType = await this.productTypesRepository.findOneById(dto.product_type_id);
        }
        if (dto.price_per_unit !== undefined) product.price_per_unit = dto.price_per_unit;
        if (dto.description !== undefined) product.description = dto.description;
        if (dto.is_active !== undefined) product.is_active = dto.is_active;

        const saved = await this.productsRepository.save(product);
        await this.cacheManager.del(this.productCacheKey(id));
        await this.clearProductsListCache();
        return saved;
    }

    async stockUpdate(id: number, dto: UpdateStockDto) {
        const result = await this.productsRepository.update(
            { product_id: id },
            { stock_quantity: dto.stock_quantity }
        );
        if (result.affected === 0) throw new NotFoundException('Товар не найден');
        await this.cacheManager.del(this.productCacheKey(id));
        await this.clearProductsListCache();
    }

    async remove(id: number) {
        const result = await this.productsRepository.update(
            { product_id: id },
            { is_active: false }
        );
        if (result.affected === 0) throw new NotFoundException('Товар не найден');
        await this.cacheManager.del(this.productCacheKey(id));
        await this.clearProductsListCache();
        return { success: true, deletedId: id };
    }

    async updateImage(id: number, imageUrl: string): Promise<Products> {
        const product = await this.productsRepository.findOneBy({ product_id: id });
        if (!product) throw new NotFoundException('Товар не найден');
        product.image_url = imageUrl;
        const saved = await this.productsRepository.save(product);
        await this.cacheManager.del(this.productCacheKey(id));
        await this.clearProductsListCache();
        return saved;
    }
}