import {
    ConflictException,
    Injectable, NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./model/user.model";
import {UserResponseDto} from "./dto/user-response.dto";
import {RolesService} from "../roles/roles.service";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JwtService,
        private readonly rolesService: RolesService
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.findByUsername(dto.username);

        if (existingUser) {
            throw new ConflictException(
                'Пользователь с таким username уже существует',
            );
        }

        const passwordHash = await bcrypt.hash(dto.password, 5);

        const user = this.userRepository.create({
            username: dto.username,
            passwordHash: passwordHash,
        });

        const role = await this.rolesService.getRoleByValue("ADMIN")

        if (!role) {
            throw new NotFoundException("Роль не найдена");
        }

        user.roles = [role]

        await this.userRepository.save(user);

        return this.generateToken(user);
    }

    async login(dto: LoginDto) {
        const user = await this.findByUsername(dto.username);

        if (!user) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        const passwordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!passwordValid) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        return this.generateToken(user);
    }

    async getCurrentUser(userId: string) : Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({
            where: {
                id: Number(userId),
            },
            relations: {
                roles: true,
            }
        });

        if (!user) {
            throw new UnauthorizedException(
                'Пользователь не найден',
            );
        }

        return {
            id: user.id,
            username: user.username,
            roles: user.roles,
        };
    }

    private async findByUsername(username: string) : Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                username: username,
            }
        })
    }

    private generateToken(user: User) {
        const payload = {
            id: user.id,
            username: user.username,
        };

        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
