import { IsEmail, IsEnum, IsISO4217CurrencyCode, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    phone: string;

    @IsISO4217CurrencyCode()
    currency: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
