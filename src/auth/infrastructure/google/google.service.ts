import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyToken(token: string): Promise<{ email: string; name: string } | null> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) return null;
      return {
        email: payload.email,
        name: payload.name,
      };
    } catch (e) {
      return null;
    }
  }
}