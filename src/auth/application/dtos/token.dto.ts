

export class TokenDto {
    accessToken: string;
    refreshToken: string;
    user: {
        picture?: string | null;
    }
}