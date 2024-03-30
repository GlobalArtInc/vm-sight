import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DockerDashboardComponent } from './docker-dashboard/docker-dashboard.component';
import { DockerContainersComponent } from './docker-containers/docker-containers.component';
import { DockerImagesComponent } from './docker-images/docker-images.component';
import { DockerNetworksComponent } from './docker-networks/docker-networks.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DockerDashboardComponent,
  },
  {
    path: 'containers',
    children: [
      {
        path: '',
        component: DockerContainersComponent,
      },
    ],
  },
  {
    path: 'images',
    children: [
      {
        path: '',
        component: DockerImagesComponent,
      },
    ],
  },
  {
    path: 'networks',
    children: [
      {
        path: '',
        component: DockerNetworksComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DockerRoutingModule {}
