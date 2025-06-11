import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { IOAuthAuthProviderOutPort } from 'src/auth/application/ports/out/oauth-provider.out.port';
import { OAuthUser } from 'src/auth/application/type/oauth-user.type';


@Injectable()
export class GoogleServiceAdapter implements IOAuthAuthProviderOutPort {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;
    private readonly client: OAuth2Client;

    constructor(private readonly configService: ConfigService) {
        this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        if (!this.clientId) {
            throw new Error('GOOGLE_CLIENT_ID is not defined');
        }

        this.clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

        if (!this.clientSecret) {
            throw new Error('GOOGLE_CLIENT_SECRET is not defined');
        }

        this.redirectUri = this.configService.get<string>('FRONTEND_URL');
        if (!this.redirectUri) {
            throw new Error('FRONTED_URL is not defined');
        }

        this.client = new OAuth2Client(this.clientId, this.clientSecret, this.redirectUri);
    }

    async verifyToken(code: string): Promise<OAuthUser | null> {
        try {
            const { tokens } = await this.client.getToken(code);
            const idToken = tokens.id_token;

            if (!idToken) return null;

            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: this.clientId,
            });
            
            const payload = ticket.getPayload();

            if (!payload || !payload.email || !payload.email_verified) {
                return null;
            }

            if (!payload.hd || !payload.hd.endsWith('.ucn.cl')) {
                return null;
            }

            const oauthUserPayload: OAuthUser = {
                email: payload.email,
                name: payload.name,
                provider: 'google',
                hostedDomain: payload.hd,
                picture: payload.picture || null,
            };

            return oauthUserPayload;
        } catch (e) {
            console.error('Token verification error:', e);
            return null;
        }
    }
}