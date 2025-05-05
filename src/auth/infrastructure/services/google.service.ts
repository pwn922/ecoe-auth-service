import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GoogleUserPayload } from '../types/google-user-payload.type';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GoogleService {
    private readonly clientId: string;
    private readonly client: OAuth2Client;

    constructor(private readonly configService: ConfigService) {
        this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        if (!this.clientId) {
            throw new Error('GOOGLE_CLIENT_ID is not defined');
        }

        this.client = new OAuth2Client(this.clientId);
    }

    // TODO: COMPROBAR CON CORREOS QUE SEAN DE LA UCN
    async verifyToken(token: string): Promise<GoogleUserPayload | null> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: this.clientId,
            });
            
            const payload = ticket.getPayload();
            
            if (!payload) return null;

            return {
                email: payload.email,
                name: payload.name,
                hd: payload.hd,
            } as GoogleUserPayload;

        } catch (e) {
            return null;    
        }
    }
}