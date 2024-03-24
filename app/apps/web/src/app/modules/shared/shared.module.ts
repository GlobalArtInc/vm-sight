import { NgModule } from '@angular/core';
import { AngularMaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
   imports: [
    AngularMaterialModule,
    ReactiveFormsModule
   ],
   exports: [
    AngularMaterialModule,
    ReactiveFormsModule,
   ],
})
export class SharedModule { }