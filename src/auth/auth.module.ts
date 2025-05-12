import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { JwtStrategy } from './infrastructure/jwt/strategies/jwt.strategy';
import { RoleEntity } from './infrastructure/entities/role.entity.orm';
import { UserEntity } from './infrastructure/entities/user.entity.orm';
import { GoogleServiceAdapter } from './infrastructure/services/google.service';
import { JwtServiceAdapter } from './infrastructure/services/jwt.service';
import { BcryptServiceAdapter } from './infrastructure/services/bcrypt.service';
import { TypeOrmRoleRepository } from './infrastructure/repositories/typeorm/role.repository';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm/user.repository';
import { VerifyOAuthUserUseCase } from './application/use-cases/verify-oauth-user.usecase';
import { UserController } from './infrastructure/controllers/user.controller';
import { TypeOrmLocalCredentialRepository } from './infrastructure/repositories/typeorm/local-credential.repository';
import { LoginLocalUserUseCase } from './application/use-cases/login-local-user.usecase';
import { LocalCredentialOrmEntity } from './infrastructure/entities/local-credential.entity.orm';
import { RabbitMQServiceAdapter } from './infrastructure/services/rabbitmq.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, LocalCredentialOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule,
  ],
  controllers: [AuthController, UserController],
  providers: [
    JwtStrategy,
    LoginUserUseCase,
    RegisterUserUseCase,
    GetUserUseCase,
    VerifyOAuthUserUseCase,
    LoginLocalUserUseCase,
    {
        provide: 'IOAuthAuthProviderOutPort',
        useClass: GoogleServiceAdapter,
    },
    {
        provide: 'IUserRepositoryOutputPort',
        useClass: TypeOrmUserRepository,
    },
    {
        provide: 'IRoleRepositoryOutputPort',
        useClass: TypeOrmRoleRepository,
    },
    {
        provide: 'ILocalCredentialRepositoryOutputPort',
        useClass: TypeOrmLocalCredentialRepository,
    },  
    {
        provide: 'IUserEventsOutPort',
        useClass: RabbitMQServiceAdapter,
    },
    {
        provide: 'IPasswordHasherOutputPort',
        useClass: BcryptServiceAdapter,
    },
    {
        provide: 'ITokenManagerOutputPort',
        useClass: JwtServiceAdapter,
    },
  ],
})
export class AuthModule {}
