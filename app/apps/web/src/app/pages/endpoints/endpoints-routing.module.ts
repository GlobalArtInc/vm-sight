import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndpointsListComponent } from './endpoints-list/endpoints-list.component';
import { EndpointsComponent } from './endpoints.component';
import { EndpointsEditComponent } from './endpoints-edit/endpoints-edit.component';
import { DockerComponent } from './docker/docker.component';

const routes: Routes = [
  {
    path: '',
    component: EndpointsComponent,
    children: [
      {
        path: ':endpointId',
        component: EndpointsEditComponent,
      },
      {
        path: ':endpointId/docker',
        component: DockerComponent,
        loadChildren: () =>
          import('./docker/docker.module').then(m => m.EndpointsDockerModule),
      },
      {
        path: '',
        component: EndpointsListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EndpointsRoutingModule {}
