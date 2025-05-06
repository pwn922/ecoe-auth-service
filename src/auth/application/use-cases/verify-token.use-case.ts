import { Inject, Injectable } from "@nestjs/common";
import { ITokenServiceOutputPort } from "../ports/out/token-service.output-port";


@Injectable()
export class VerifyTokenUseCase {
    constructor(
        @Inject('ITokenServiceOutputPort')
        private readonly tokenService: ITokenServiceOutputPort,
    ) {}

    async execute(token: string): Promise<boolean> {
        const decodedToken = await this.tokenService.verifyToken(token);
        return !!decodedToken;
    }
}