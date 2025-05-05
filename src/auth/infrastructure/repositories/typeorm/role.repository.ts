import { InjectRepository } from "@nestjs/typeorm";
import { IRoleRepositoryOutputPort } from "src/auth/domain/ports/out/role.repository.out.port";
import { RoleEntity } from "../../entities/role.entity.orm";
import { Repository } from "typeorm";
import { RoleMapper } from "../../mappers/role.mapper";
import { Injectable } from "@nestjs/common";
import { Role } from "src/auth/domain/entities/role.entity";

@Injectable()
export class TypeOrmRoleRepository implements IRoleRepositoryOutputPort {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly rolesRepository: Repository<RoleEntity>
    ) {}

    async findByName(name: string): Promise<Role | null> {
        const entity = await this.rolesRepository.findOne({
            where: { name: name },
        });
        
        if (!entity) {
            return null;
        }

        return RoleMapper.toDomain(entity);
    }
}