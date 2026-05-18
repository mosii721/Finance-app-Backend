import { PartialType } from '@nestjs/mapped-types';
import { CreateSavingGoalDto } from './create-saving-goal.dto';

export class UpdateSavingGoalDto extends PartialType(CreateSavingGoalDto) {}
