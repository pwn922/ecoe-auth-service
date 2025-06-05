import { TokenPayloadDto } from '../../dtos/token-payload.dto';

export interface ITokenManagerPort  {
    generateAccessToken(payload: TokenPayloadDto): Promise<string>;
    generateRefreshToken(payload: TokenPayloadDto): Promise<string>;
    verifyAccessToken(token: string): Promise<TokenPayloadDto | null>;
}