import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SavingGoalStatus } from "../entities/saving-goal.entity";

export class CreateSavingGoalDto {
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    userId:string;

    @IsString()
    @IsOptional()
    accountId:string;

    @IsNumber()
    @IsNotEmpty()
    targetAmount: number;

    @IsNumber()
    currentAmount: number;

    @IsString()
    @IsNotEmpty()
    targetDate: string;

    @IsEnum(SavingGoalStatus)
    status: SavingGoalStatus;
}

export class SavingsAmountDto {
  @IsNumber()
  addAmount: number;
}
