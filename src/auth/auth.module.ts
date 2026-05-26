import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User]), JwtModule.register({global: true}), PassportModule],
  controllers: [AuthController],
  providers: [AuthService,AtStrategy,RtStrategy,{
    provide:APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AuthModule {}
