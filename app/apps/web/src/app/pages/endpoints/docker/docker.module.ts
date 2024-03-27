import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DockerRoutingModule } from './docker-routing.module';
import { EndpointsService } from '../endpoints.service';
import { SharedModule } from '../../../shared/shared.module';
import { DockerComponent } from './docker.component';
import { DockerDashboardComponent } from './docker-dashboard/docker-dashboard.component';
import { DockerContainersComponent } from './docker-containers/docker-containers.component';
import { DockerImagesComponent } from './docker-images/docker-images.component';
import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';

@NgModule({
  declarations: [
    DockerComponent,
    DockerDashboardComponent,
    DockerContainersComponent,
    DockerImagesComponent,
  ],
  imports: [
    CommonModule,
    DockerRoutingModule,
    SharedModule,
  ],
})
export class EndpointsDockerModule { }
