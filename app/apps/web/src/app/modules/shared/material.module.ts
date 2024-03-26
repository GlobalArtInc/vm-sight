import { NgModule } from "@angular/core";

import { MatProgressBarModule } from "@angular/material/progress-bar";

const importsAndExports = [
  MatProgressBarModule,
]

@NgModule({
  imports: [...importsAndExports],
  exports: [...importsAndExports],
})
export class MaterialUiModule {}