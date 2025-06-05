import { Role } from "src/auth/domain/entities/role.entity";
import { RoleEntity } from "../entities/role.entity.orm";



export class RoleMapper {
    static toDomain(entity: RoleEntity): Role {
        return Role.fromPrimitives({
            id: entity.id,
            name: entity.name,
        });
    }

    static toEntity(role: Role): RoleEntity {
        const rolePrimitives = role.toPrimitives();
        const entity = new RoleEntity();
        entity.id = rolePrimitives.id;
        entity.name = rolePrimitives.name;
        return entity;
    }
}