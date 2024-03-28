import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersComponent } from './users.component';
import { TableModule } from 'src/app/modules/table/table.module';
import { UsersListComponent } from './users-list/users-list.component';


@NgModule({
  declarations: [UsersComponent, UsersListComponent],
  imports: [
    CommonModule,
    TableModule,
    UsersRoutingModule,
    SharedModule,
  ]
})
export class UsersModule { }
