import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Account } from './entities/account.entity';

@Module({
  imports:[DatabaseModule,TypeOrmModule.forFeature([User,Account])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
