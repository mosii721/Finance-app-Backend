import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TransactionType } from "../entities/transaction.entity";

export class CreateTransactionDto {
    @IsNumber()
    amount: number;

    @IsString()
    accountId:string;

    @IsString()
    userId:string;
    
    @IsString()
    @IsOptional()
    categoryId?:string;

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
