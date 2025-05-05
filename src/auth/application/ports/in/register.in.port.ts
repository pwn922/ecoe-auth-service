import { User } from "src/auth/domain/entities/user.entity";
import { RegisterUserDto } from "../../dtos/register-user.dto";

export interface RegisterUserInputPort {
  execute(registerUserDto: RegisterUserDto): Promise<User>;
}