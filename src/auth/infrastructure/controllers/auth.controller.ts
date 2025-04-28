import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/application/services/auth.service';
import { LoginUserCommand } from 'src/auth/application/commands/login-user.command';
import { RegisterUserCommand } from 'src/auth/application/commands/register-user.command';
import { LoginUserDto } from '../dtos/login-user.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { GoogleLoginDto } from '../dtos/google-login.dto';
import { AuthUseCase} from 'src/auth/application/use-cases/auth.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authUseCase: AuthUseCase,
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto): Promise<{ accessToken: string }> {
    const command = new LoginUserCommand(body.email, body.password);
    const accessToken = await this.authService.login(command);
    return { accessToken };
  }

  @Post('register')
  async register(@Body() body: RegisterUserDto): Promise<void> {
    const command = new RegisterUserCommand(
      body.fullname,
      body.email,
      body.password,
    );

    await this.authService.register(command);
  }

  @Post('google-login')
async googleLogin(@Body() body: GoogleLoginDto) {
  return this.authUseCase.loginWithGoogle(body.token, body.userType, body.teacherType);
}

}