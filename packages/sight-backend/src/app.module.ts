import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import configs from './config';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';
import { InstancesModule } from './instances/instances.module';
import { Session } from './auth/auth.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configs],
    }),
    TypeOrmModule.forFeature([User, Session]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('databaseConfiguration'),
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    CommonModule,
    UserModule,
    InstancesModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
