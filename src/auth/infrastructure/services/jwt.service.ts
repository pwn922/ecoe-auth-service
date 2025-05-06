import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenServiceOutputPort } from '../../application/ports/out/token-service.output-port';
import { TokenPayloadDto } from '../../application/dtos/token-payload.dto';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from 'src/auth/application/dtos/token.dto';

@Injectable()
export class JwtServiceAdapter implements ITokenServiceOutputPort {
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
            expiresIn: '1h',
        });
    }

    async generateRefreshToken(payload: TokenPayloadDto): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
    }

    async verifyToken(token: string): Promise<TokenDto> {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            });
        } catch (error) {
            return null;
        }
    }
}