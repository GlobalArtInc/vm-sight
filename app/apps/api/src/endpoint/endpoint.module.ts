import { Module } from '@nestjs/common';
import { EndpointControllerProtected } from './controllers/endpoint.protected-controller';
import { EndpointService } from './endpoint.service';
import { SharedModule } from '@app/shared';
import { EndpointsRoute } from './routes';
import { DockerService } from './routes/docker.service';

@Module({
  imports: [SharedModule],
  controllers: [EndpointControllerProtected],
  providers: [EndpointService, EndpointsRoute, DockerService],
})
export class EndpointModule {}
