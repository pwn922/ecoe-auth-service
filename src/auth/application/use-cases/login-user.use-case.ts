import { Inject } from '@nestjs/common';
import { LoginUserDto } from '../dtos/login-user.dto';
import { TokenPayloadDto } from '../dtos/token-payload.dto';
import { IUserRepositoryOutputPort } from 'src/auth/domain/ports/out/user.repository.out.port';
import { UnauthorizedAccessError } from '../errors/unauthorized-access.error';
import { UserMapper } from '../mappers/user.mapper';
import { LoginUserInputPort } from '../ports/in/login.in.port';
import { TokenDto } from '../dtos/token.dto';
import { ITokenManagerPort } from '../ports/out/token-manager.out.port';


export class LoginUserUseCase implements LoginUserInputPort {
    constructor(
        @Inject('IUserRepositoryOutputPort')
        private readonly userRepository: IUserRepositoryOutputPort,

        @Inject('ITokenManagerOutputPort')
        private readonly tokenService: ITokenManagerPort,
    ) {}

    async execute(dto: LoginUserDto): Promise<TokenDto> {
        try {
            if (!dto.oauthUser) {
                throw new UnauthorizedAccessError('Invalid oauth user');
            }

            const user = await this.userRepository.findByEmail(dto.oauthUser.email);

            if (!user) {
                throw new UnauthorizedAccessError('Invalid user');
            }

            const userPrimitives = UserMapper.toPrimitives(user);
            const oauthFullname = dto.oauthUser.name;
            if (user.getFullname() !== oauthFullname) {
                const updatedUser = UserMapper.toDomain({
                    ...userPrimitives,
                    fullname: oauthFullname,
                });
                await this.userRepository.update(updatedUser);
            }
            
            if (userPrimitives.role.name !== dto.userType) {
                throw new UnauthorizedAccessError('Invalid user role');
            }

            const tokenPayload: TokenPayloadDto = {
                sub: userPrimitives.id,
                email: userPrimitives.email,
                role: userPrimitives.role.name,
            };

            const accessToken = await this.tokenService.generateAccessToken(tokenPayload);
            const refreshToken = await this.tokenService.generateRefreshToken(tokenPayload);
            const token: TokenDto = {
                accessToken,
                refreshToken,
            };

            return token
        } catch (error) {
            throw new UnauthorizedAccessError('Unauthorized access');
        }
    }
}