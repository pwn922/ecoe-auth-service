import { Inject } from '@nestjs/common';

import { LoginLocalUserInputPort } from '../ports/in/login-local.in.port';
import { IUserRepositoryOutputPort } from 'src/auth/domain/ports/out/user.repository.out.port';
import { ITokenManagerPort } from '../ports/out/token-manager.out.port';

import { LoginLocalUserDto } from '../dtos/login-local-user.dto';
import { TokenDto } from '../dtos/token.dto';
import { TokenPayloadDto } from '../dtos/token-payload.dto';
import { UnauthorizedAccessError } from '../errors/unauthorized-access.error';
import { UserMapper } from '../mappers/user.mapper';
import { IPasswordHasherOutputPort } from '../ports/out/password-hasher.output-port';
import { ILocalCredentialRepositoryOutputPort } from 'src/auth/domain/ports/out/local-credential.repository.out.port';

export class LoginLocalUserUseCase implements LoginLocalUserInputPort {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort,

        @Inject('ILocalCredentialRepositoryOutputPort')
        private readonly credentialRepo: ILocalCredentialRepositoryOutputPort,

        @Inject('ITokenManagerOutputPort')
        private readonly tokenService: ITokenManagerPort,

        @Inject('IPasswordHasherOutputPort')
        private readonly passwordHasher: IPasswordHasherOutputPort,
    ) {}

    async execute(dto: LoginLocalUserDto): Promise<TokenDto> {
        const user = await this.userRepository.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedAccessError('Invalid credentials');
        }

        const userPrimitives = UserMapper.toPrimitives(user);

        const creds = await this.credentialRepo.findByUserId(userPrimitives.id);

        if (!creds) {
            throw new UnauthorizedAccessError('Invalid credentials');
        }

        const isPasswordValid = await this.passwordHasher.compare(
            dto.password,
            creds.getPasswordHash(),
        );

        if (!isPasswordValid) {
            throw new UnauthorizedAccessError('Invalid credentials');
        }

        const payload: TokenPayloadDto = {
            sub: userPrimitives.id,
            email: userPrimitives.email,
            role: userPrimitives.role.name,
        };

        const accessToken = await this.tokenService.generateAccessToken(payload);
        const refreshToken = await this.tokenService.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
            user: {
                picture: userPrimitives.picture ?? null,
            },
        };
    }
}
