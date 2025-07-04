import { Controller, Get, HttpCode, HttpStatus, UseGuards, Post, Body, InternalServerErrorException, ConflictException, NotFoundException, Param, Delete } from '@nestjs/common';
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
import { UserIdDto } from '../dtos/user-id.dto';
import { DeleteUserUseCase } from 'src/auth/application/use-cases/delete-user.use-case';
import { GetUsersUseCase } from 'src/auth/application/use-cases/get-users.use-case';


@Controller('api/v1/auth/users')
export class UserController {
    constructor(
        private readonly getUserUseCase: GetUserUseCase,
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly getUsersUseCase: GetUsersUseCase,
    ) {}

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async getUserMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
        const userId = user.sub;
        try {
            const userFound = await this.getUserUseCase.execute(userId);
            const userPayload: UserResponseDto = {
                id: userFound.id,
                email: userFound.email,
                fullname: userFound.fullname,
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

    @Get(':id')
    async getUserById(@Param() param: UserIdDto): Promise<UserResponseDto> {
        try {
            const userFound = await this.getUserUseCase.execute(param.id);
            const userPayload: UserResponseDto = {
                id: userFound.id,
                email: userFound.email,
                fullname: userFound.fullname,
                role: userFound.role,
            };

            return userPayload;
        }

        catch (error) {
            if (error instanceof UserNotFoundError) {
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    //@UseGuards(AuthGuard('jwt'), RolesGuard)
    //@Roles('jefatura')
    async createUser(@Body() body: UserRequestDto) {
        const { email, role } = body;
        const registerUserDto: RegisterUserDto = { email, role };

        try {
            const newUser = await this.registerUserUseCase.execute(registerUserDto);
            return newUser;
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

    @Delete(':id')
    async deleteUser(@Param() param: UserIdDto): Promise<void> {
        try {
            await this.deleteUserUseCase.execute(param.id);
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                throw new NotFoundException('User not found');
            }

            throw new InternalServerErrorException('Failed to delete user');
        }
    }

    @Get()
    async getUsers() {
        try {
            const users = await this.getUsersUseCase.execute();
            return users.map((user) => ({
                id: user.getId(),
                email: user.getEmail(),
                fullname: user.getFullname(),
                role: user.getRole().toPrimitives().name,
            }));
        } catch (error) {
            throw new InternalServerErrorException('Failed to get users');
        }
    }
}
