import { Injectable } from '@nestjs/common';
import {Role} from "./model/role.model";
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class RolesService {

    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async createRole(dto: CreateRoleDto) : Promise<Role> {
        const role = this.roleRepository.create(dto);
        return await this.roleRepository.save(role);
    }

    async getAllRoles(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    async getRoleByValue(value: string) : Promise<Role | null> {
        return await this.roleRepository.findOne({
            where: {value}
        });
    }

}
