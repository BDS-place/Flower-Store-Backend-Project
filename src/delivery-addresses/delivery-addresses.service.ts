import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryAddresses } from './entities/delivery-addresses.entity';
import { Repository } from 'typeorm';
import { CreateDeliveryAddressDto } from './dto/create-delivery-addresses.dto';
import { UpdateDeliveryAddressesDto } from './dto/update-delivery-addresses.dto';

@Injectable()
export class DeliveryAddressesService {
    constructor(
        @InjectRepository(DeliveryAddresses)
        private readonly DeliveryAddressesRepository: Repository<DeliveryAddresses>
    ){}

    async create(dto:CreateDeliveryAddressDto){
        const existing = await this.DeliveryAddressesRepository.findOne({where:{city:dto.city,street:dto.street,house:dto.house,apartment_number:dto.apartment_number}})
        if(existing) return existing;
        const deliveryAddress = this.DeliveryAddressesRepository.create(dto)
        return this.DeliveryAddressesRepository.save(deliveryAddress)
    }
    async findOneById(id: number){
        const deliveryAddress = await this.DeliveryAddressesRepository.findOne({where:{delivery_address_id:id}})
        if(!deliveryAddress) throw new NotFoundException('Адресс не найден');
        return deliveryAddress;
    }
    async findAll(){
        return await this.DeliveryAddressesRepository.find()
    }
    async update(id: number, dto:UpdateDeliveryAddressesDto){
        const deliveryAddress = await this.DeliveryAddressesRepository.findOne({where:{delivery_address_id:id}});
        if(!deliveryAddress) throw new NotFoundException('Адресс не найден');
        const merged = {
            city: dto.city ?? deliveryAddress.city,
            street: dto.street ?? deliveryAddress.street,
            house: dto.house ?? deliveryAddress.house,
            apartment_number: dto.apartment_number ?? deliveryAddress.apartment_number,
        };
        const existing = await this.DeliveryAddressesRepository.findOne({
            where:{
                city:merged.city,
                street:merged.street,
                house:merged.house,
                apartment_number:merged.apartment_number}
            })
        if(existing && existing.delivery_address_id !== id) throw new ConflictException('Такой адрес уже есть');
        Object.assign(deliveryAddress, merged);
        return this.DeliveryAddressesRepository.save(deliveryAddress);
    }
    async delete(id:number){
        const result = await this.DeliveryAddressesRepository.delete(id)
        if(result.affected === 0) throw new NotFoundException('Адрес не найден');
        return {success: true, deletedId: id}
    }
}
