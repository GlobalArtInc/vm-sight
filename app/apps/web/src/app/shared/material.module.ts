import { NgModule } from "@angular/core";

import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from '@angular/material/table'
import {MatPaginatorModule} from '@angular/material/paginator';

const importsAndExports = [
  MatProgressBarModule,
  MatTableModule,
  MatPaginatorModule,
]

@NgModule({
  imports: [...importsAndExports],
  exports: [...importsAndExports],
})
export class MaterialUiModule {}