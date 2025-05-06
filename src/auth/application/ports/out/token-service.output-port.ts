import { TokenPayloadDto } from '../../dtos/token-payload.dto';
import { TokenDto } from '../../dtos/token.dto';

export interface ITokenServiceOutputPort {
    generateAccessToken(payload: TokenPayloadDto): Promise<string>;
    generateRefreshToken(payload: TokenPayloadDto): Promise<string>;
    verifyToken(token: string): Promise<TokenDto>;
}