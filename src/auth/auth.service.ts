import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from './types/jwt-payload.type.js';
@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) { }
    async register(registerUser: RegisterDto) {

        const existingUser = await this.userService.findByEmail(registerUser.email);
        if (existingUser) {
            throw new ConflictException("Email is  already in exist");
        }

        const hashedPassword = await bcrypt.hash(registerUser.password, 10);

        const registerUserBody = await this.userService.createUser({
            first_name: registerUser.first_name,
            last_name: registerUser.last_name,
            email: registerUser.email,
            password: hashedPassword
        })

        return { message: "Register User", status: "success", data: { first_name: registerUserBody.first_name, last_name: registerUserBody.last_name, email: registerUserBody.email } };

    }
    async login(loginUser: LoginDto) {
        const userInfo = await this.userService.findByEmail(loginUser.email);
        if (!userInfo) {
            throw new UnauthorizedException("Invalid email or password");
        }
        const isPasswordValid = await bcrypt.compare(loginUser.password, userInfo.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password");
        }
        const payload: JwtPayload = {
            sub: userInfo.id,
            email: userInfo.email,
            role: userInfo.role,
        };

        const accessToken = this.jwtService.sign(payload);
        return { message: "Login User", status: "success", data: { access_token: accessToken } };


    }
}
