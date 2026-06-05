import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetsModule } from './budgets/budgets.module';
import { SavingGoalsModule } from './saving-goals/saving-goals.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AtGuard } from './auth/guards/at.guard';
import { LoggerMiddleware } from './logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [ UsersModule, AccountsModule, CategoriesModule, TransactionsModule, BudgetsModule, SavingGoalsModule, AuthModule,ConfigModule.forRoot({ isGlobal:  true}), DatabaseModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        ttl: configService.getOrThrow<number>('THROTTLER_TTL',30000),
        limit: configService.getOrThrow<number>('THROTTLER_LIMIT', 10)
      }]
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ttl: configService.getOrThrow<number>('CACHE_TTL', 30000), lruSize: configService.getOrThrow<number>('CACHE_LRUSIZE', 5000)})
            }),
            new Keyv({
              store: new KeyvRedis(configService.getOrThrow<string>('REDIS_URL')),
              ttl: configService.getOrThrow<number>('CACHE_TTL', 30000),
              namespace: configService.getOrThrow<string>('REDIS_NAMESPACE')
            })
          ]
        }
      }
    })
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AtGuard
  },
  { 
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor
  },],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes('users')
  }
  }
