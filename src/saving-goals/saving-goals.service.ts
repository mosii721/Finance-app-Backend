import { Injectable } from '@nestjs/common';
import { CreateSavingGoalDto } from './dto/create-saving-goal.dto';
import { UpdateSavingGoalDto } from './dto/update-saving-goal.dto';

@Injectable()
export class SavingGoalsService {
  create(createSavingGoalDto: CreateSavingGoalDto) {
    return 'This action adds a new savingGoal';
  }

  findAll() {
    return `This action returns all savingGoals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} savingGoal`;
  }

  update(id: number, updateSavingGoalDto: UpdateSavingGoalDto) {
    return `This action updates a #${id} savingGoal`;
  }

  remove(id: number) {
    return `This action removes a #${id} savingGoal`;
  }
}
