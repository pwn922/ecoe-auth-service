import { TokenPayloadDto } from '../../dtos/token-payload.dto';

export interface ITokenServiceOutputPort {
    generateAccessToken(payload: TokenPayloadDto): Promise<string>;
    generateRefreshToken(payload: TokenPayloadDto): Promise<string>;
}