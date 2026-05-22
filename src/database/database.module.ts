import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.getOrThrow<string>('DB_URL'),
                synchronize: configService.getOrThrow<boolean>('DB_SYNC'),
                autoLoadEntities:true,
                ssl:{rejectUnauthorized:false},
                logging: configService.getOrThrow<boolean>('DB_LOG'),
                migrations:[__dirname + 'migrations/**/*{.ts,.js}'],
            }),
            inject: [ConfigService]
        })
    ],

})
export class DatabaseModule {}
