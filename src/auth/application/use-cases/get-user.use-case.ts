import { Inject } from "@nestjs/common";
import { IUserRepositoryOutputPort } from "src/auth/domain/ports/out/user.repository.out.port";
import { UserDto } from "../dtos/user.dto";
import { UserNotFoundError } from "src/auth/domain/errors/user-not-found.error";
import { UserMapper } from "../mappers/user.mapper";


export class GetUserUseCase {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort,
    ) {}

    async execute(userId: string): Promise<UserDto> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new UserNotFoundError(`User with ID ${userId} not found`);
        }

        const userPrimitives = UserMapper.toPrimitives(user);
        const userDto: UserDto = {
            id: userPrimitives.id,
            fullname: userPrimitives.fullname,
            email: userPrimitives.email,
            role: userPrimitives.role.name,
        }

        return userDto;
    }
}