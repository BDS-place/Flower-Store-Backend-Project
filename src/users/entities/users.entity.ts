import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Orders } from "src/orders/entities/orders.entity";
@Entity('users')
export class Users{

    @ApiProperty({description: 'Уникальный идентификатор пользователя', example:'123'})
    @PrimaryGeneratedColumn()
    user_id!:number

    @ApiProperty({description:'Email пользователя, обязательно уникальный',example:'example@index.com'})
    @Column()
    email!:string

    @ApiProperty({description:'Захешированый пароль пользователя',example:'yr9g21y08tg0827f3'})
    @Column()
    password_hash!:string

    @ApiProperty({description:'Номер телефона пользователя, обязательно уникальный',example:'+74959998877'})
    @Column()
    phone_number!:string

    @ApiProperty({description:'Имя пользователя',example:'Иван'})
    @Column()
    first_name!:string

    @ApiProperty({description:'Фамилия пользователя',example:'Иванов'})
    @Column()
    last_name!:string

    @ApiPropertyOptional({description:'День рождения пользователя',example:'01.01.2001', required:false})
    @Column({nullable:true})
    birthday?:string

    @ApiProperty({description:'Статус аккаунта пользователя',example:true})
    @Column({default:true})
    is_active!:boolean

    @ApiProperty({description:'',example:''})
    @Column({default:'customer'})
    role!:string
    
    @ApiProperty({description:'Дата создания пользователя',example:'2024-01-15T10:30:00.000Z'})
    @CreateDateColumn()
    created_at!:Date

    @ApiProperty({description:'Дата обновления пользователя',example:'2024-02-15T10:30:00.000Z'})
    @UpdateDateColumn()
    updated_at!:Date

    @ApiProperty()
    @Column({ type: 'varchar', nullable: true, select: false })
    refresh_token_hash?: string | null;

    @ApiProperty()
    @OneToMany(() => Orders, (order) => order.user)
    orders!: Orders[]
}