import { LoginUserDto } from "../../dtos/login-user.dto";
import { TokenDto } from "../../dtos/token.dto";

export interface LoginUserInputPort {
  execute(dto: LoginUserDto): Promise<TokenDto>;
}