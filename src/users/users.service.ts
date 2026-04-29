import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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
    async updateProfile(id: number, updateData:UpdateUserDto):Promise<Users>{
        const user = await this.usersRepository.findOneBy({user_id:id})
        if(!user) throw new NotFoundException('User not found');

        if(updateData.email && updateData.email !== user.email){
            const existing = await this.usersRepository.findOneBy({email:updateData.email})
            if(existing) throw new ConflictException('Email already in use')
        }

        Object.assign(user,updateData)
        return this.usersRepository.save(user)
    }
    async changePassword(id:number, dto:ChangePasswordDto): Promise<void>{
        const user = await this.usersRepository.findOneBy({user_id:id})
        if(!user) throw new NotFoundException('User not found')
        
        const isMatch = await bcrypt.compare(dto.old_password, user.password_hash)
        if(!isMatch) throw new UnauthorizedException('Wrong password')
        user.password_hash = await bcrypt.hash(dto.new_password, 10)
        await this.usersRepository.save(user)
    } 
    async find(user_id:number):Promise<Users>{
        const user = await this.usersRepository.findOneBy({user_id});
        if(!user) {
        throw new NotFoundException('User not found')
        }
        return user
    }
async delete(user_id: number) {
    const result = await this.usersRepository.delete({ user_id: user_id });
    if (result.affected === 0) {
        throw new NotFoundException('User not found');
    }
    return { success: true, deletedId: user_id };
}

    async findByEmail(email: string): Promise<Users | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<Users | null> {
        return this.usersRepository.findOne({ where: { user_id: id } });
    }

    async updateRefreshTokenHash(userId: number, hash: string | null) {
        return this.usersRepository.update(userId, { refresh_token_hash: hash });
    }
    async findByIdWithRefreshToken(id: number): Promise<Users | null> {
    return this.usersRepository.findOne({
        where: { user_id: id },
        select: ['user_id', 'email', 'role', 'refresh_token_hash'], // нужные поля
    });
    }
}
