import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CategoryType } from "../entities/category.entity";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(CategoryType)
    type: CategoryType;

    @IsString()
    @IsOptional()
    colour?: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsBoolean()
    isDefault: boolean;
}
