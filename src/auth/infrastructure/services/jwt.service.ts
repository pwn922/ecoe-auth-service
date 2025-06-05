import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from '../../application/dtos/token-payload.dto';
import { ConfigService } from '@nestjs/config';
import { ITokenManagerPort } from 'src/auth/application/ports/out/token-manager.out.port';

@Injectable()
export class JwtServiceAdapter implements ITokenManagerPort {
    private readonly jwtAccessSecret: string;
    private readonly jwtRefreshSecret: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.jwtAccessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
        this.jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

        if (!this.jwtAccessSecret || !this.jwtRefreshSecret) {
            throw new Error('JWT secrets not found in environment variables');
        }
    }

    async generateAccessToken(payload: TokenPayloadDto): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '1d',
        });
    }

    async generateRefreshToken(payload: TokenPayloadDto): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
    }

    async verifyAccessToken(token: string): Promise<TokenPayloadDto | null> {
        return this.jwtService.verifyAsync<TokenPayloadDto>(token, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        }).catch(() => null);
    }
}