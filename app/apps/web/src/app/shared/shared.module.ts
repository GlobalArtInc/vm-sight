import { NgModule } from "@angular/core";
import { MaterialUiModule } from "./material.module";
import { SharedComponentsModule } from "./components.module";

@NgModule({
  imports: [MaterialUiModule, SharedComponentsModule],
  exports: [MaterialUiModule, SharedComponentsModule],
})
export class SharedModule {};