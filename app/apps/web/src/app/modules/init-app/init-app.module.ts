import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitAppRoutingModule } from './init-app-routing.module';
import { InitAppComponent } from './init-app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { InitAppCreateAdminComponent } from './init-app-create-admin/init-app-create-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n';

@NgModule({
  declarations: [InitAppComponent, InitAppCreateAdminComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    InitAppRoutingModule,
    SharedModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class InitAppModule {}
