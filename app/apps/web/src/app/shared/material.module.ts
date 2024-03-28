import { NgModule } from "@angular/core";

import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from '@angular/material/table'
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';

const importsAndExports = [
  MatProgressBarModule,
  MatTableModule,
  MatPaginatorModule,
  MatCheckboxModule,
]

@NgModule({
  imports: [...importsAndExports],
  exports: [...importsAndExports],
})
export class MaterialUiModule {}