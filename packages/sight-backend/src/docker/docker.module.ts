import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/auth/auth.entity';
import { Instances, InstancesConfig } from 'src/instances/instances.entity';
import { InstancesService } from 'src/instances/instances.service';
import { User } from 'src/user/user.entity';
import { DockerController } from './docker.controller';
import { DockerService } from './docker.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, Instances, InstancesConfig])],
  controllers: [DockerController],
  providers: [DockerService, InstancesService],
  exports: [DockerService],
})
export class DockerModule {}
