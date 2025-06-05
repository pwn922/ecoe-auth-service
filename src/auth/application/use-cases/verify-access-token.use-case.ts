import { Inject } from "@nestjs/common";
import { TokenPayloadDto } from "../dtos/token-payload.dto";
import { ITokenManagerPort } from "../ports/out/token-manager.out.port";


export class VerifyAccessTokenUseCase {
    constructor(
        @Inject('ITokenManagerOutputPort')
        private readonly tokenService: ITokenManagerPort,
    ) {}

    async execute(token: string): Promise<TokenPayloadDto | null> {
        const decodedToken = await this.tokenService.verifyAccessToken(token);
        return decodedToken ?? null;
    }
}