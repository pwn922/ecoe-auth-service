import { OAuthUser } from '../../type/oauth-user.type';

export interface VerifyOAuthUserInputPort {
    execute(code: string): Promise<OAuthUser>;
}
