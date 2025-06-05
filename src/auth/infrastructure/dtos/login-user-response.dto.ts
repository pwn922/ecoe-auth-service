import { IsNotEmpty, IsString } from "class-validator";


export class LoginUserResponseDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}