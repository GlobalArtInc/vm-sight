import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DockerRoutingModule } from './docker-routing.module';
import { EndpointsService } from '../endpoints.service';
import { SharedModule } from '../../../shared/shared.module';
import { DockerComponent } from './docker.component';
import { DockerDashboardComponent } from './docker-dashboard/docker-dashboard.component';
import { DockerContainersComponent } from './docker-containers/docker-containers.component';

@NgModule({
  declarations: [
    DockerComponent,
    DockerDashboardComponent,
    DockerContainersComponent,
  ],
  imports: [
    CommonModule,
    DockerRoutingModule,
    SharedModule,
  ],
})
export class EndpointsDockerModule { }
