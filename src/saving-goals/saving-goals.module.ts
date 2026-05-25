import { Module } from '@nestjs/common';
import { SavingGoalsService } from './saving-goals.service';
import { SavingGoalsController } from './saving-goals.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingGoal } from './entities/saving-goal.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([SavingGoal,User])],
  controllers: [SavingGoalsController],
  providers: [SavingGoalsService]
})
export class SavingGoalsModule {}
