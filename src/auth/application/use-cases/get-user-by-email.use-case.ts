import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/auth/domain/entities/user.entity";
import { UserNotFoundError } from "src/auth/domain/errors/user-not-found.error";
import { IUserRepositoryOutputPort } from "src/auth/domain/ports/out/user.repository.out.port";

@Injectable()
export class GetUserByEmailUseCase  {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort,
    ) {}

    async execute(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new UserNotFoundError('User not found');
        }

        return user;
    }
}