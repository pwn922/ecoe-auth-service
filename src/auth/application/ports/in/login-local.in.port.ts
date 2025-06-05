import { LoginLocalUserDto } from '../../dtos/login-local-user.dto';
import { TokenDto } from '../../dtos/token.dto';


export interface LoginLocalUserInputPort {
    execute(dto: LoginLocalUserDto): Promise<TokenDto>;
}
