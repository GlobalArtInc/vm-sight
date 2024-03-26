import { NgModule } from "@angular/core";
import { WidgetCountWithIconComponent } from "./components/widgets";
import { RouterLink } from "@angular/router";

const SHARED_COMPONENTS = [
  WidgetCountWithIconComponent,
];

const SHARED_IMPORTS_AND_EXPORTS = [
  RouterLink,
];

@NgModule({
  imports: [...SHARED_IMPORTS_AND_EXPORTS],
  declarations: [...SHARED_COMPONENTS],
  exports: [...SHARED_COMPONENTS, ...SHARED_IMPORTS_AND_EXPORTS],
}) 
export class SharedComponentsModule {}