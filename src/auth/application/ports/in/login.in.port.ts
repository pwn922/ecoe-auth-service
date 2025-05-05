import { LoginUserDto } from "../../dtos/login-user.dto";

export interface LoginUserInputPort {
  execute(dto: LoginUserDto): Promise<string>;
}