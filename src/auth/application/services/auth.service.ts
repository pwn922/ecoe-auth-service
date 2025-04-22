import { Injectable } from "@nestjs/common";
import { LoginUserCommand } from "../commands/login-user.command";
import { RegisterUserCommand } from "../commands/register-user.command";
import { LoginUserUseCase } from "../use-cases/login-user.use-case";
import { RegisterUserUseCase } from "../use-cases/register-user.use-case";


@Injectable()
export class AuthService {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase,
    ) {}

    async register(command: RegisterUserCommand): Promise<void> {
        await this.registerUserUseCase.execute(command);
    }

    async login(command: LoginUserCommand): Promise<string> {
        return await this.loginUserUseCase.execute(command);
    }
}