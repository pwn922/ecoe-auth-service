import { OAuthUser } from "../../type/oauth-user.type";


export interface IOAuthAuthProviderOutPort {
    verifyToken(code: string): Promise<OAuthUser | null>;
}
