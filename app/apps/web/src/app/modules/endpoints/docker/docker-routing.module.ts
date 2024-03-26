import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DockerDashboardComponent } from './docker-dashboard/docker-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DockerDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockerRoutingModule { }
