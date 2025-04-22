import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenServiceOutputPort } from '../../application/ports/out/token-service.output-port';
import { TokenPayloadCommand } from '../../application/commands/token-payload.command';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtServiceAdapter implements ITokenServiceOutputPort {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async generateAccessToken(payload: TokenPayloadCommand): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '1h',
        });
    }

    async generateRefreshToken(payload: TokenPayloadCommand): Promise<string> {
        throw new Error('Method not implemented.');
    }


    // async verifyToken(token: string): Promise<any> {
    //   try {
    //     return await this.jwtService.verifyAsync(token, {
    //       secret: this.configService.get<string>('JWT_SECRET'),
    //     });
    //   } catch (error) {
    //     return null; // O lanzar una excepción específica
    //   }
    // }
}