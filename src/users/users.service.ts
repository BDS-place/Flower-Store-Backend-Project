import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository:Repository<Users>,
    ){}

    async create(createUserDto: CreateUserDto): Promise<Users>{
        const {password, email, phone_number, ...userData} = createUserDto
        const existing = await this.usersRepository.findOne({
            where:[{email}, {phone_number}]
        });

        if(existing) throw new ConflictException('Этот email или телефон уже используется')

        const password_hash: string = await bcrypt.hash(password,10)
        const user = this.usersRepository.create({...userData, password_hash, email, phone_number});
        try{
        return this.usersRepository.save(user)
    }catch(err){
        throw err
    }
    }
    async update(updateUserDto:UpdateUserDto, id:number):Promise<Users>{
        const{password_hash,email,phone_number,...userData} = updateUserDto
    } 
    async delete():Promise<Users>{
    }
    async findAll():Promise<Users>{
    }
    async find(id:number):Promise<Users>{
        const user = await this.usersRepository.findOneBy({id});
        if(!user) {
        throw new NotFoundException()
        }
        return user
    }

}
