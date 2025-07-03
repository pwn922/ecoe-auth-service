import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/auth/domain/entities/user.entity";
import { IUserRepositoryOutputPort } from "src/auth/domain/ports/out/user.repository.out.port";

@Injectable()
export class GetUsersUseCase {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort,
    ) {}

    async execute(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}