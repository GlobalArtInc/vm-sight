import { Module } from "@nestjs/common";
import { ApiController } from './api/api.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configs from '@app/shared/configs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configs }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({ ...configService.get('db') }),
    }),
  ],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
