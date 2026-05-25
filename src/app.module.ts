import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetsModule } from './budgets/budgets.module';
import { SavingGoalsModule } from './saving-goals/saving-goals.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { AtGuard } from './auth/guards/at.guard';


@Module({
  imports: [ UsersModule, AccountsModule, CategoriesModule, TransactionsModule, BudgetsModule, SavingGoalsModule, AuthModule,ConfigModule.forRoot({ isGlobal:  true}), DatabaseModule],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AtGuard
  },
  {
    provide:APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AppModule {}
