import { IsNotEmpty, IsString } from "class-validator";


export class LoginLocalUserRequestDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}