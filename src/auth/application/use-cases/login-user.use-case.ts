import { Inject, Injectable } from '@nestjs/common';
import { IUserRepositoryOutputPort } from '../ports/out/user.repository.out.port';
import { IPasswordHasherOutputPort } from '../ports/out/password-hasher.output-port';
import { ITokenServiceOutputPort } from '../ports/out/token-service.output-port';
import { LoginUserCommand } from '../commands/login-user.command';
import { LoginUserInputPort } from '../ports/in/login.in.port';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { TokenPayloadCommand } from '../commands/token-payload.command';

@Injectable()
export class LoginUserUseCase implements LoginUserInputPort {
  constructor(
    @Inject('IUserRepositoryOutputPort')
    private readonly userRepository: IUserRepositoryOutputPort,

    @Inject('IPasswordHasherOutputPort')
    private readonly passwordHasher: IPasswordHasherOutputPort,

    @Inject('ITokenServiceOutputPort')
    private readonly tokenService: ITokenServiceOutputPort,
  ) {}

  async execute(command: LoginUserCommand): Promise<string> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new InvalidCredentialsException('Invalid credentials');
    }

    const userPrimitives = user.toPrimitives();

    const isPasswordValid = await this.passwordHasher.compare(
      command.password,
      userPrimitives.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException('Invalid credentials');
    }

    const tokenPayload: TokenPayloadCommand = {
      sub: userPrimitives.id,
      email: userPrimitives.email,
    };

    return this.tokenService.generateAccessToken(tokenPayload);
  }
}
