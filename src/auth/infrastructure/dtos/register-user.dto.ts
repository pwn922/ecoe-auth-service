import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}

