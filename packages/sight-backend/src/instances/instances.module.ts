import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instances, InstancesConfig } from './instances.entity';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { User } from 'src/user/user.entity';
import { Session } from 'src/auth/auth.entity';
import { DockerService } from 'src/docker/docker.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, Instances, InstancesConfig])],
  controllers: [InstancesController],
  providers: [InstancesService, DockerService],
})
export class InstancesModule {}
