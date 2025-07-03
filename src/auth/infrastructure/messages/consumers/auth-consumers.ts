import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthPatterns } from '../../constants/auth-patterns.constants';
import { GetUserUseCase } from 'src/auth/application/use-cases/get-user.use-case';
import { UserDto } from 'src/auth/application/dtos/user.dto';

@Controller()
export class AuthConsumers {
    constructor(private readonly getUserProfileUseCase: GetUserUseCase) { }

    @MessagePattern(AuthPatterns.GET_USER_PROFILE)
    async getUserProfile(@Payload() payload: { userId: string }): Promise<UserDto> {
        return this.getUserProfileUseCase.execute(payload.userId);
    }
}
