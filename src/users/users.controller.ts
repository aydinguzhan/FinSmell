import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserCreateEntity } from './entities/create-user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ResponseFormatInterceptor } from '../conf/inceptor/transform.inceptor.js';

@Controller('users')
@UseInterceptors(ResponseFormatInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Get()
    async findAll() {
        return await this.usersService.findAll();
    }
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }
}
