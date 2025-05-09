import { Controller, Get, HttpCode, HttpStatus, UseGuards, Req, Post, Body, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../jwt/decorators/current-user.decorator';
import { JwtPayload } from '../jwt/types/jwt-payload.interface';
import { UserRequestDto } from '../dtos/user-request.dto';
import { RegisterUserUseCase } from 'src/auth/application/use-cases/register-user.use-case';
import { Roles } from '../jwt/decorators/roles.decorator';
import { RegisterUserDto } from 'src/auth/application/dtos/register-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { GetUserUseCase } from 'src/auth/application/use-cases/get-user.use-case';
import { RolesGuard } from '../jwt/guards/roles.guard';
import { EmitStudentRegisterUseCase } from 'src/auth/application/use-cases/emit-student-register.use-case';
import { EmitStudentRegisterError } from 'src/auth/application/errors/emit-student-register.error';
import { In } from 'typeorm';


@Controller('api/v1/users')
export class UserController {
    constructor(
        private readonly getUserUseCase: GetUserUseCase,
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly emitStudentRegisteredUseCase: EmitStudentRegisterUseCase,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    @HttpCode(HttpStatus.OK)
    async get(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
        try {
            const userId = user.sub;
            const foundUser = await this.getUserUseCase.execute(userId);
            if (!foundUser) {
                throw new InternalServerErrorException('User not found');
            }

            const userPayload: UserResponseDto = {
                id: foundUser.id,
                email: foundUser.email,
                role: foundUser.role,
            };

            return userPayload;    
        }
        catch (error) {
            throw new InternalServerErrorException(`Failed to get user: ${error.message}`);
        }
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles('jefatura')
    async create(@Body() body: UserRequestDto): Promise<void> {
        try {
            const { rut, email, role } = body;
            const registerUserDto: RegisterUserDto = {
                email,
                role,
            };

            const user = await this.registerUserUseCase.execute(registerUserDto);

            if (!user) {
                throw new InternalServerErrorException('User not created');
            }

            await this.emitStudentRegisteredUseCase.execute(user);
        }
        catch (error) {
            if (error instanceof EmitStudentRegisterError) {
                throw new InternalServerErrorException('Failed to emit student registered event');
            }

            throw new InternalServerErrorException(`Failed to create user: ${error.message}`);
        }
    }
}
