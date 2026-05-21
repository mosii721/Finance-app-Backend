import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BudgetPeriod } from "../entities/budget.entity";

export class CreateBudgetDto {
    @IsNumber()
    limitAmount: number;

    @IsString()
    @IsNotEmpty()
    userId:string

    @IsString()
    @IsNotEmpty()
    categoryId:string
    
    @IsNumber()
    spentAmount: number;

    @IsEnum(BudgetPeriod)
    period: BudgetPeriod;

    @IsString()
    startDate: string;

    @IsString()
    endDate: string;
}
