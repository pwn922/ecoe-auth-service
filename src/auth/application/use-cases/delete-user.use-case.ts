import { Inject, Injectable } from "@nestjs/common";
import { IUserRepositoryOutputPort } from "src/auth/domain/ports/out/user.repository.out.port";
import { UserNotFoundError } from "src/auth/domain/errors/user-not-found.error";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort,

        @Inject('STUDENT_SERVICE')
        private readonly studentClient: ClientProxy
    ) { }

    async execute(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundError('User not found');
        }

        if (user.getRole().toPrimitives().name === 'estudiante') {
            this.studentClient.emit('student.delete_by_user_id', { userId });
        }

        await this.userRepository.delete(user.getId());
    }
}

