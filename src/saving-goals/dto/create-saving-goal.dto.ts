import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { SavingGoalStatus } from "../entities/saving-goal.entity";

export class CreateSavingGoalDto {
    @IsString()
    @IsNotEmpty()
    name:string;

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
