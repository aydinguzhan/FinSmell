import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateEntity } from './entities/create-user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserCreateEntity)
        private usersRepository: Repository<UserCreateEntity>,
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserCreateEntity> {

        const user = await this.usersRepository.create(createUserDto);

        return this.usersRepository.save(user);
    }
    async findAll(): Promise<UserCreateEntity[]> {
        return this.usersRepository.find();
    }
    async findByEmail(email: string): Promise<UserCreateEntity | null> {
        return this.usersRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();
    }

    async findById(id: string): Promise<UserCreateEntity | null> {
        return this.usersRepository.findOne({ where: { id } });
    }
}
