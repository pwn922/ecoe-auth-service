import { OAuthUser } from "../type/oauth-user.type";


export class LoginUserDto {
    oauthUser: OAuthUser;
    userType: string;
}
