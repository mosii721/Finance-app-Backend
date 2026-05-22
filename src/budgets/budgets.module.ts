import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Budget,User,Category])],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}
