// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserEntity } from './infrastructure/entities/user.entity.orm';
import { AuthService } from './application/services/auth.service';

import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';

import { JwtServiceAdapter } from './infrastructure/services/jwt.service';
import { BcryptServiceAdapter } from './infrastructure/services/bcrypt.service';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm/user.repository';

import { AuthUseCase } from './application/use-cases/auth.use-case';
import { GoogleService } from './infrastructure/google/google.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginUserUseCase,
    RegisterUserUseCase,
    AuthUseCase,
    GoogleService,
    {
      provide: 'IUserRepositoryOutputPort',
      useClass: TypeOrmUserRepository,
    },

    {
      provide: 'IPasswordHasherOutputPort',
      useClass: BcryptServiceAdapter,
    },
    {
      provide: 'ITokenServiceOutputPort',
      useClass: JwtServiceAdapter,
    },

  ],
})
export class AuthModule {}
