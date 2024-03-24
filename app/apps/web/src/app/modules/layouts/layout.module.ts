import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // children: Routing,
  },
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class LayoutModule {}
