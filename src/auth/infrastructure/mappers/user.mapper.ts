import { User } from 'src/auth/domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity.orm';
import { RoleMapper } from './role.mapper';

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        return User.fromPrimitives({
            id: entity.id,
            fullname: entity.fullname,
            email: entity.email,
            role: {
                id: entity.role.id,
                name: entity.role.name,
            }
        });
    }

    static toEntity(user: User): UserEntity {
        const role = user.getRole();
        const entity = new UserEntity();
        entity.id = user.getId();
        entity.fullname = user.getFullname();
        entity.email = user.getEmail();
        entity.role = RoleMapper.toEntity(role);

        return entity;
    }
}
