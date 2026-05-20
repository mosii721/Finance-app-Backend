import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TransactionType } from "../entities/transaction.entity";

export class CreateTransactionDto {
    @IsNumber()
    Amount: number;

    @IsEnum(TransactionType)
    type: TransactionType;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    transactionDate: string;
}
