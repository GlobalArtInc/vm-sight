import { NgModule } from "@angular/core";
import { MaterialUiModule } from "./material.module";



@NgModule({
  imports: [MaterialUiModule],
  exports: [MaterialUiModule],
})
export class SharedModule {};