import { NgModule } from '@angular/core';
import { AngularMaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [AngularMaterialModule, ToastrModule.forRoot(), ReactiveFormsModule],
  exports: [AngularMaterialModule, ReactiveFormsModule],
})
export class SharedModule {}
