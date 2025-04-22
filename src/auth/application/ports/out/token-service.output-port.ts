import { TokenPayloadCommand } from '../../commands/token-payload.command';

export interface ITokenServiceOutputPort {
    generateAccessToken(payload: TokenPayloadCommand): Promise<string>;
    generateRefreshToken(payload: TokenPayloadCommand): Promise<string>;
}