import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AtGuard } from './auth/guards/at.guard';
import { LoggerMiddleware } from './logger.middleware';


@Module({
  imports: [ UsersModule, AccountsModule, CategoriesModule, TransactionsModule, BudgetsModule, SavingGoalsModule, AuthModule,ConfigModule.forRoot({ isGlobal:  true}), DatabaseModule],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AtGuard
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes('users')
  }
  }
