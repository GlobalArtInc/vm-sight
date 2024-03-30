import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [TableComponent],
  imports: [CommonModule, DataTablesModule],
  exports: [TableComponent],
})
export class TableModule {}
