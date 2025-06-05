import { Role } from "../../entities/role.entity";


export interface IRoleRepositoryOutputPort {
    findByName(name: string): Promise<Role | null>;
}