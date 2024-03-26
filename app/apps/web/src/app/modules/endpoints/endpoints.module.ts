import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndpointsRoutingModule } from './endpoints-routing.module';
import { EndpointsComponent } from './endpoints.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [EndpointsComponent],
  imports: [
    CommonModule,
    EndpointsRoutingModule,
  ]
})
export class EndpointsModule { }
