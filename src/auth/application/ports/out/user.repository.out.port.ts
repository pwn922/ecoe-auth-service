import { User } from "src/auth/domain/entities/user.entity";
import { CreateUserCommand } from "../../commands/created-user.command";


export interface IUserRepositoryOutputPort {
    create(user: CreateUserCommand): Promise<User>;
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}