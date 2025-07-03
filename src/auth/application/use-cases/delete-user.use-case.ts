import { Inject, Injectable } from "@nestjs/common";
import { UserNotFoundError } from "src/auth/domain/errors/user-not-found.error";
import { IUserRepositoryOutputPort } from "src/auth/domain/ports/out/user.repository.out.port";

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort
    ) {}

    async execute(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new UserNotFoundError('User not found');
        }

        await this.userRepository.delete(user.getId());
    }
}