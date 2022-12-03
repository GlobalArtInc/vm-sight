import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instances } from './instances.entity';
import { InstancesService } from './instances.service';

@Module({
  imports: [TypeOrmModule.forFeature([Instances])],
  providers: [InstancesService],
})
export class InstancesModule {}
