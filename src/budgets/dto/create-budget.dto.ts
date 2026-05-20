import { IsEnum, IsNumber, IsString } from "class-validator";
import { BudgetPeriod } from "../entities/budget.entity";

export class CreateBudgetDto {
    @IsNumber()
    limitAmount: number;

    @IsNumber()
    spentAmount: number;

    @IsEnum(BudgetPeriod)
    period: BudgetPeriod;

    @IsString()
    startDate: string;

    @IsString()
    endDate: string;
}
