import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {HttpModule} from '@nestjs/axios'

const DAL_MODELS: any = [];

const DAL_ENTITIES: any = [];

const DAL_PROVIDERS: any = [];

@Module({
  imports: [TypeOrmModule.forFeature([...DAL_ENTITIES]), HttpModule],
  providers: [...DAL_MODELS, ...DAL_PROVIDERS, ConfigService],
  exports: [TypeOrmModule.forFeature([...DAL_ENTITIES]), ...DAL_MODELS, ...DAL_PROVIDERS, ConfigService],
})
export class SharedModule {}
