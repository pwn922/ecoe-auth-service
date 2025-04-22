import { IUserRepositoryOutputPort } from "../ports/out/user.repository.out.port";
import { RegisterUserInputPort } from "../ports/in/register.in.port";
import { UserAlreadyExistsException } from "src/auth/domain/exceptions/user-already-exists.exception";
import { RegisterUserCommand } from "../commands/register-user.command";
import { IPasswordHasherOutputPort } from "../ports/out/password-hasher.output-port";
import { CreateUserCommand } from "../commands/created-user.command";
import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class RegisterUserUseCase implements RegisterUserInputPort {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort,
        @Inject('IPasswordHasherOutputPort')
        private readonly passwordHasher: IPasswordHasherOutputPort,
    ) {}

    async execute(command: RegisterUserCommand): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(command.email);
        if (existingUser) {
            throw new UserAlreadyExistsException('User already exists');
        }

        const hashedPassword = await this.passwordHasher.hash(command.password);

        const createUserCommand = new CreateUserCommand(
            command.fullname,
            command.email,
            hashedPassword
        );

        const newUser = await this.userRepository.create(createUserCommand);
        await this.userRepository.save(newUser);
    }
}
