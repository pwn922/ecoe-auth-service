import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, InternalServerErrorException, UnauthorizedException, Req, Get } from '@nestjs/common';
import { LoginUserRequestDto, LoginUserResponseDto } from '../dtos/login-user.dto';
import { RegisterUserRequestDto } from '../dtos/register-user.dto';
// import { GoogleLoginDto } from '../dtos/google-login.dto';
import { LoginUserUseCase } from 'src/auth/application/use-cases/login-user.use-case';
import { LoginUserDto } from 'src/auth/application/dtos/login-user.dto';
import { RegisterUserUseCase } from 'src/auth/application/use-cases/register-user.use-case';
import { RegisterUserDto } from 'src/auth/application/dtos/register-user.dto';
import { GoogleService } from '../services/google.service';
import { UnauthorizedAccessError } from 'src/auth/application/errors/unauthorized-access.error';
import { TokenDto } from 'src/auth/application/dtos/token.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private readonly loginUserUseCase: LoginUserUseCase,
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly googleService: GoogleService,
        private readonly jwtService: JwtService,
    ) {}

    // TODO: FALTARIA EL REGISTER DE UNA JEFATURA, O VER COMO HACERLO
    // @Post('register-jefatura')
    //
    
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginUserRequestDto): Promise<TokenDto> {
        try {
            const code = body.code;
            const googleUserPayload = await this.googleService.verifyToken(code);
            if (!googleUserPayload) {
                throw new UnauthorizedException("Unauthorized access");
            }

            const loginUserDto: LoginUserDto = {
                email: googleUserPayload.email,
                userType: body.userType
            };
            
            const token = await this.loginUserUseCase.execute(loginUserDto);
            return token;
        } catch (error) {
            if (error instanceof UnauthorizedAccessError) {
                throw new UnauthorizedException(error.message);
            }

            // console.error('Unexpected error during login:', error);
            throw error;
        }
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterUserRequestDto): Promise<void> {
        try {
            const registerUser: RegisterUserDto = {
                //fullname: body.fullname,
                email: body.email,
                role: body.role,
            };

            console.log(registerUser);

            const user = await this.registerUserUseCase.execute(registerUser);
            if (!user) {
                throw new BadRequestException('Failed to register user');
            }

        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while registering the user: ${error.message}`);
        }
    }

    @Get('user-info')
    @HttpCode(HttpStatus.OK)
    async getUserInfo(@Req() req: Request): Promise<any> {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                throw new UnauthorizedException('No Authorization header');
            }
            const token = authHeader.replace('Bearer ', '');
            const payload = this.jwtService.decode(token);
    
            if (!payload) {
                throw new UnauthorizedException('Invalid token');
            }
    
            return { payload };
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while retrieving user info: ${error.message}`);
        }
    }

}