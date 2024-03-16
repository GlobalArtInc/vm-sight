import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EndpointModule } from './endpoint/endpoint.module';
import { ApiService } from './api.service';
import configs from '@app/shared/configs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configs }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({ ...configService.get('db') }),
      dataSourceFactory: async (options) => addTransactionalDataSource(new DataSource(options)),
    }),
    SharedModule,
    UserModule,
    AuthModule,
    EndpointModule,
  ],
  controllers: [],
  providers: [ApiService],
})
export class ApiModule {}
