import { Inject } from "@nestjs/common";
import { IUserRepositoryOutputPort } from "src/auth/domain/ports/out/user.repository.out.port";
import { IRoleRepositoryOutputPort } from "src/auth/domain/ports/out/role.repository.out.port";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { UserMapper } from "../mappers/user.mapper";
import { User } from "src/auth/domain/entities/user.entity";
import { UserAlreadyExistsError } from "../errors/user-already-exists.error";
import { RoleNotFoundError } from "src/auth/domain/errors/role-not-found.error";
import { RegisterUserInputPort } from "../ports/in/register.in.port";


export class RegisterUserUseCase implements RegisterUserInputPort {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort,
        @Inject('IRoleRepositoryOutputPort')
        private readonly roleRepository: IRoleRepositoryOutputPort,
    ) {}

    async execute(registerUserDto: RegisterUserDto): Promise<User> {
        const roleExists = await this.roleRepository.findByName(registerUserDto.role);
        
        if (!roleExists) {
            throw new RoleNotFoundError('Role not found');
        }

        const userExists = await this.checkUserExists(registerUserDto.email);
        if (userExists) {
            throw new UserAlreadyExistsError('User already exists');
        }
        
        const user = UserMapper.toDomain({
            id: undefined,
            fullname: null,
            email: registerUserDto.email,
            role: {
                id: roleExists.toPrimitives().id,
                name: roleExists.toPrimitives().name,
            },
        });

        const newUser = await this.userRepository.save(user);

        return newUser;
    }

    private async checkUserExists(email: string): Promise<boolean> {
        const existingUser = await this.userRepository.findByEmail(email);
        return !!existingUser;
    }
}

