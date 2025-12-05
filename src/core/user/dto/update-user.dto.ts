
import {IsEmail, IsOptional, IsString} from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    login: string

    @IsOptional()
    @IsString()
    oldPassword: string;

    @IsOptional()
    @IsString()
    newPassword: string;
}
