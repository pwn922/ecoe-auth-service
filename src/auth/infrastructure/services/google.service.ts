import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GoogleUserPayload } from '../types/google-user-payload.type';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GoogleService {
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

        this.redirectUri = this.configService.get<string>('FRONTED_URL');
        if (!this.redirectUri) {
            throw new Error('FRONTED_URL is not defined');
        }

        this.client = new OAuth2Client(this.clientId, this.clientSecret, this.redirectUri);
    }

    // TODO: COMPROBAR CON CORREOS QUE SEAN DE LA UCN
    async verifyToken(code: string): Promise<GoogleUserPayload | null> {
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

            const googleUserPayload: GoogleUserPayload = {
                email: payload.email,
                name: payload.name,
                hd: payload.hd,
            };

            return googleUserPayload;
        } catch (e) {
            console.error('Token verification error:', e);
            return null;
        }
    }

}