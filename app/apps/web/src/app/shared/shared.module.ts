import { NgModule } from "@angular/core";
import { MaterialUiModule } from "./material.module";
import { SharedComponentsModule } from "./components.module";
import { SharedModule as MetronicModule } from "../_metronic/shared/shared.module";

@NgModule({
  imports: [MaterialUiModule, MetronicModule, SharedComponentsModule],
  exports: [MaterialUiModule, MetronicModule, SharedComponentsModule],
})
export class SharedModule {};