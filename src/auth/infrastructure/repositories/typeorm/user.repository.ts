import { CreateUserCommand } from "src/auth/application/commands/created-user.command";
import { IUserRepositoryOutputPort } from "src/auth/application/ports/out/user.repository.out.port";
import { User } from "src/auth/domain/entities/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from "../../entities/user.entity.orm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";


@Injectable()
export class TypeOrmUserRepository implements IUserRepositoryOutputPort {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<User>,
    ) {}

    create(user: CreateUserCommand): Promise<User> {
        throw new Error("Method not implemented.");
    }

    save(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    findByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    update(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}