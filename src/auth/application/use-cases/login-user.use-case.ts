import { Inject, Injectable } from '@nestjs/common';
import { ITokenServiceOutputPort } from '../ports/out/token-service.output-port';
import { LoginUserDto } from '../dtos/login-user.dto';
import { TokenPayloadDto } from '../dtos/token-payload.dto';
import { IUserRepositoryOutputPort } from 'src/auth/domain/ports/out/user.repository.out.port';
import { UnauthorizedAccessError } from '../errors/unauthorized-access.error';
import { UserMapper } from '../mappers/user.mapper';
import { LoginUserInputPort } from '../ports/in/login.in.port';

@Injectable()
export class LoginUserUseCase implements LoginUserInputPort {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort,

        @Inject('ITokenServiceOutputPort')
        private readonly tokenService: ITokenServiceOutputPort,
    ) {}

    async execute(dto: LoginUserDto): Promise<string> {
        try {
            const user = await this.userRepository.findByEmail(dto.email);

            if (!user) {
                throw new UnauthorizedAccessError('Unauthorized access');
            }

            if (user.getRole().toPrimitives().name !== dto.userType) {
                throw new UnauthorizedAccessError('User role does not match');
            }

            const userPrimitives = UserMapper.toPrimitives(user);

            const tokenPayload: TokenPayloadDto = {
                sub: userPrimitives.id,
                email: userPrimitives.email,
                role: userPrimitives.role.name,
            };

            // TODO: AGREGAR EL REFRESH TOKEN Y CREAR DTO TOKENS
            return await this.tokenService.generateAccessToken(tokenPayload);
        } catch (error) {
            throw new UnauthorizedAccessError('Unauthorized access');
        }
    }
}