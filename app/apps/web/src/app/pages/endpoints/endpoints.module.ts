import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndpointsRoutingModule } from './endpoints-routing.module';
import { EndpointsComponent } from './endpoints.component';
import { CrudModule } from '../../modules/crud/crud.module';
import { EndpointsListComponent } from './endpoints-list/endpoints-list.component';
import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EndpointsComponent, EndpointsListComponent],
  imports: [CommonModule, EndpointsRoutingModule, CrudModule, SharedModule],
})
export class EndpointsModule {}
