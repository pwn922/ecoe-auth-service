// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserEntity } from './infrastructure/entities/user.entity.orm';

import { LoginUserUseCase } from './application/use-cases/login-user.use-case';

import { JwtServiceAdapter } from './infrastructure/services/jwt.service';
//import { BcryptServiceAdapter } from './infrastructure/services/bcrypt.service';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm/user.repository';
import { RoleEntity } from './infrastructure/entities/role.entity.orm';
//import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { TypeOrmRoleRepository } from './infrastructure/repositories/typeorm/role.repository';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { GoogleService } from './infrastructure/services/google.service';

// import { AuthUseCase } from './application/use-cases/auth.use-case';
//import { GoogleService } from './infrastructure/services/google.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUserUseCase,
    RegisterUserUseCase,
    // AuthUseCase,
    GoogleService,
    {
      provide: 'IUserRepositoryOutputPort',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'IRoleRepositoryOutputPort',
      useClass: TypeOrmRoleRepository,
    },
    /*
    {
      provide: 'IPasswordHasherOutputPort',
      useClass: BcryptServiceAdapter,
    },
    */
    {
      provide: 'ITokenServiceOutputPort',
      useClass: JwtServiceAdapter,
    },

  ],
})
export class AuthModule {}
