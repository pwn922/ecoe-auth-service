import { Inject } from '@nestjs/common';
import { VerifyOAuthUserInputPort } from '../ports/in/verify-oauth-user.in.port';
import { IOAuthAuthProviderOutPort } from '../ports/out/oauth-provider.out.port';
import { UnauthorizedAccessError } from '../errors/unauthorized-access.error';
import { OAuthUser } from '../type/oauth-user.type';


export class VerifyOAuthUserUseCase implements VerifyOAuthUserInputPort {
    constructor(
        @Inject('IOAuthAuthProviderOutPort')
        private readonly oauthService: IOAuthAuthProviderOutPort,
    ) {}

    async execute(code: string): Promise<OAuthUser> {
        const payload = await this.oauthService.verifyToken(code);

        if (!payload) {
            throw new UnauthorizedAccessError('Invalid OAuth token');
        }

        return payload;
    }
}
