import { AccountType } from "../entities/account.entity";
import { IsBoolean, IsEnum, IsISO4217CurrencyCode, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    name: string;

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
