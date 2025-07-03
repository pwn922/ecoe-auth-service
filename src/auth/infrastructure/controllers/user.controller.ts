import { Controller, Get, HttpCode, HttpStatus, UseGuards, Post, Body, InternalServerErrorException, ConflictException, NotFoundException } from '@nestjs/common';
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
import { UserNotFoundError } from 'src/auth/domain/errors/user-not-found.error';
import { RoleNotFoundError } from 'src/auth/domain/errors/role-not-found.error';
import { UserAlreadyExistsError } from 'src/auth/application/errors/user-already-exists.error';


@Controller('api/v1/auth/users')
export class UserController {
    constructor(
        private readonly getUserUseCase: GetUserUseCase,
        private readonly registerUserUseCase: RegisterUserUseCase,
    ) {}

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async get(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
        const userId = user.sub;
        try {
            const userFound = await this.getUserUseCase.execute(userId);
            const userPayload: UserResponseDto = {
                id: userFound.id,
                email: userFound.email,
                role: userFound.role,
            };

            return userPayload;    
        }
        catch (error) {
            if (error instanceof UserNotFoundError) {
                throw new InternalServerErrorException(error.message);
            }

            throw new InternalServerErrorException('Failed to get user');
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    //@UseGuards(AuthGuard('jwt'), RolesGuard)
    //@Roles('jefatura')
    async create(@Body() body: UserRequestDto) {
        const { email, role } = body;
        const registerUserDto: RegisterUserDto = { email, role };

        try {
            await this.registerUserUseCase.execute(registerUserDto);
            return { message: 'User created successfully' };
        } catch (error) {
            if (error instanceof UserAlreadyExistsError) {
                throw new ConflictException('User already exists');
            }

            if (error instanceof RoleNotFoundError) {
                throw new NotFoundException('Role not found');
            }

            throw new InternalServerErrorException('Unexpected error occurred while creating user');
        }
    }
}
