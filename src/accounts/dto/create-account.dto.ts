import { AccountType } from "../entities/account.entity";
import { IsBoolean, IsEnum, IsISO4217CurrencyCode, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    userId:string

    @IsEnum(AccountType)
    type: AccountType;

    @IsNumber()
    @IsNotEmpty()
    balance: number;

    @IsISO4217CurrencyCode()
    currency: string;

    @IsBoolean()
    isActive: boolean;
}
