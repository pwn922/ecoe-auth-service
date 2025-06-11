
export interface OAuthUser {
    email: string;
    name: string;
    provider?: string;
    hostedDomain?: string;
    picture?: string | null;
}
