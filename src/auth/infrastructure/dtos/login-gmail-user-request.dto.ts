import { IsNotEmpty, IsString } from "class-validator";


export class LoginGmailUserRequestDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    userType: string;
}

