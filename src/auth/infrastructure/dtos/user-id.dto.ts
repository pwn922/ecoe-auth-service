import { IsNotEmpty, IsString, IsUUID, isUUID } from "class-validator";

export class UserIdDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    id: string;
}