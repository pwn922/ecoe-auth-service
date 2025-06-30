import { Controller, Post, Body, HttpCode, HttpStatus, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginGmailUserRequestDto } from '../dtos/login-gmail-user-request.dto';
import { LoginUserUseCase } from 'src/auth/application/use-cases/login-user.use-case';
import { LoginUserDto } from 'src/auth/application/dtos/login-user.dto';
import { UnauthorizedAccessError } from 'src/auth/application/errors/unauthorized-access.error';
import { TokenDto } from 'src/auth/application/dtos/token.dto';
import { VerifyOAuthUserUseCase } from 'src/auth/application/use-cases/verify-oauth-user.usecase';
import { LoginLocalUserRequestDto } from '../dtos/login-local-user-request.dto';
import { LoginLocalUserUseCase } from 'src/auth/application/use-cases/login-local-user.usecase';
import { LoginLocalUserDto } from 'src/auth/application/dtos/login-local-user.dto';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { GetUserUseCase } from 'src/auth/application/use-cases/get-user.use-case';
import { validate as isUUID } from 'uuid';
import { UserNotFoundError } from 'src/auth/domain/errors/user-not-found.error';

@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private readonly loginUserUseCase: LoginUserUseCase,
        private readonly verifyOAuthUserUseCase: VerifyOAuthUserUseCase,
        private readonly loginLocalUserUseCase: LoginLocalUserUseCase,
        private readonly getUserUseCase: GetUserUseCase,
    ) {}
 

    @Post('login-local')
    @HttpCode(HttpStatus.OK)
    async loginLocal(@Body() body: LoginLocalUserRequestDto): Promise<TokenDto> {
        try {
            const { email, password } = body;
            const loginLocalUserDto: LoginLocalUserDto = {
                email: email,
                password: password
            };

            return await this.loginLocalUserUseCase.execute(loginLocalUserDto);
        }
        catch (error) {     
            if (error instanceof UnauthorizedAccessError) {
                throw new UnauthorizedException(error.message);
            }
            
            console.error('Error during login process:', error.message);
            throw new InternalServerErrorException('Unexpected error during login process.');
        }
    }
    
    @Post('login-gmail')
    @HttpCode(HttpStatus.OK)
    async loginWithGmail(@Body() body: LoginGmailUserRequestDto): Promise<TokenDto> {
        try {
            const { code, userType } = body;

            const oauthUser = await this.verifyOAuthUserUseCase.execute(code);
            const loginUserDto: LoginUserDto = {
                oauthUser: oauthUser,
                userType: userType
            };

            const token = await this.loginUserUseCase.execute(loginUserDto);
            
            return token;
        }
        catch (error) {
            if (error instanceof UnauthorizedAccessError) {
                throw new UnauthorizedException(error.message);
            }

            throw new InternalServerErrorException(`An error occurred while logging in: ${error.message}`);
        }
    }

    @MessagePattern('validate_user_student')
    async validateUserStudent(userId: string): Promise<boolean> {
        try {
            console.log('Validating user ID:', userId);
            const user = await this.getUserUseCase.execute(userId);
            console.log('User found:', user);
            if (!user || user.role !== 'estudiante') {
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error during user validation:', typeof error, error);
            if (error instanceof UserNotFoundError) {
                return false;    
            }
            
            console.error('Error during user validation:', error);
            throw new RpcException('Error during user validation');
        }
    }

    @MessagePattern('validate_user_teacher')
    async validateUserTeacher(userId: string): Promise<boolean> {
        try {
            console.log('Validating user ID:', userId);
            const user = await this.getUserUseCase.execute(userId);
            console.log('User found:', user);
            if (!user || user.role !== 'docente-asignatura') {
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error during user validation:', typeof error, error);
            if (error instanceof UserNotFoundError) {
                return false;    
            }
            
            console.error('Error during user validation:', error);
            throw new RpcException('Error during user validation');
        }
    }
}