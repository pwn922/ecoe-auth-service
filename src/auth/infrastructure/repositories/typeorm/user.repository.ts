import { User } from "src/auth/domain/entities/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../entities/user.entity.orm";
import { IUserRepositoryOutputPort } from "src/auth/domain/ports/out/user.repository.out.port";
import { UserMapper } from "../../mappers/user.mapper";


@Injectable()
export class TypeOrmUserRepository implements IUserRepositoryOutputPort {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {}

    async save(user: User): Promise<User> {
        const entity = this.usersRepository.create(
            UserMapper.toEntity(user)
        );

        const saved = await this.usersRepository.save(entity);
        return UserMapper.toDomain(saved);
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.usersRepository.findOne({
            where: { id },
            relations: ['role'],
        });

        if (!entity) {
            return null;
        }

        return UserMapper.toDomain(entity);
    }

    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.usersRepository.findOne({
            where: { email },
            relations: ['role'],
        });

        if (!entity) {
            return null;
        }

        return UserMapper.toDomain(entity);
    }

    async findAll(): Promise<User[]> {
        const entities = await this.usersRepository.find({
            where: { isProtected: false },
            relations: ['role'],
        });

        return entities.map((entity) => UserMapper.toDomain(entity));
    }

    async update(user: User): Promise<void> {
        const entity = await this.usersRepository.findOne({
            where: { id: user.getId() },
            relations: ['role'],
        });

        if (!entity) {
            throw new Error(`User with id ${user.getId()} not found`);
        }

        const userUpdated = UserMapper.toEntity(user);

        await this.usersRepository.save(userUpdated);
    }

    async delete(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}