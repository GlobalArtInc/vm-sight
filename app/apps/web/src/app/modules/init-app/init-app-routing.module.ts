import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitAppComponent } from './init-app.component';
import { InitAppCreateAdminComponent } from './init-app-create-admin/init-app-create-admin.component';

const routes: Routes = [
  {
    path: '',
    component: InitAppComponent,
    children: [
      {
        path: '',
        component: InitAppCreateAdminComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitAppRoutingModule {}
