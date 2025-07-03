import { User } from "src/auth/domain/entities/user.entity";


export interface IUserRepositoryOutputPort {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}