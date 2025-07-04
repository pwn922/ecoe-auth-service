import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthPatterns } from '../../constants/auth-patterns.constants';
import { GetUserUseCase } from 'src/auth/application/use-cases/get-user.use-case';
import { UserDto } from 'src/auth/application/dtos/user.dto';
import { GetUserByEmailUseCase } from 'src/auth/application/use-cases/get-user-by-email.use-case';
import { CreateUserPayloadDto } from '../../dtos/create-user.dto';
import { RegisterUserUseCase } from 'src/auth/application/use-cases/register-user.use-case';

@Controller()
export class AuthConsumers {
    constructor(
        private readonly getUserProfileUseCase: GetUserUseCase,
        private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
        private readonly registerUserUseCase: RegisterUserUseCase,
    ) { }

    @MessagePattern(AuthPatterns.GET_USER_PROFILE)
    async getUserProfile(@Payload() payload: { userId: string }): Promise<UserDto> {
        return this.getUserProfileUseCase.execute(payload.userId);
    }

    @MessagePattern('auth.check_email_exists')
    async checkEmailExists(@Payload() payload: { email: string }): Promise<boolean> {
        try {
            await this.getUserByEmailUseCase.execute(payload.email);
            return true;
        } catch (error) {
            return false;
        }
    }

    @MessagePattern('auth.create_user')
    async createUser(@Payload() payload: CreateUserPayloadDto): Promise<string> {
        const user = await this.registerUserUseCase.execute(payload);
        return user.getId();
    }
}
