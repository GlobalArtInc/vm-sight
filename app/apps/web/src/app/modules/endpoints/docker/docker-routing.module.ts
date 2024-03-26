import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DockerDashboardComponent } from './docker-dashboard/docker-dashboard.component';
import { DockerContainersComponent } from './docker-containers/docker-containers.component';

const routes: Routes = [
  {
    path: '',
    component: DockerDashboardComponent,
  },
  {
    path: 'containers',
    children: [
      {
        path: '',
        component: DockerContainersComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockerRoutingModule { }
