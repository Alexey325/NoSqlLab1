import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './types/user.interface';

@Injectable()
export class AuthService {
    private users = new Map<string, User>();

    constructor(private jwtService: JwtService) {}

    async register(dto: RegisterDto) {
        const existingUser = this.findByUsername(dto.username);

        if (existingUser) {
            throw new ConflictException('User with this username already exists');
        }

        const passwordHash = await bcrypt.hash(dto.password, 5);

        const user: User = {
            id: randomUUID(),
            username: dto.username,
            passwordHash,
        };

        this.users.set(user.id, user);

        return this.generateToken(user);
    }

    async login(dto: LoginDto) {
        const user = this.findByUsername(dto.username);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user);
    }

    getCurrentUser(userId: string) {
        const user = this.users.get(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            username: user.username,
        };
    }

    private findByUsername(username: string): User | undefined {
        return [...this.users.values()].find(
            (user) => user.username === username,
        );
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
