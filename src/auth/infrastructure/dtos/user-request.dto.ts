import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class UserRequestDto {
    @IsString()
    @IsOptional()
    rut: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    role: string;
}

