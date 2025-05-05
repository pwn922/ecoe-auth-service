import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserRequestDto {
    @IsString()
    @IsNotEmpty()
    idToken: string;

    @IsString()
    @IsNotEmpty()
    userType: string;
}

export class LoginUserResponseDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}