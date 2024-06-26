import {
  NgModule,
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { APIInterceptor } from './interceptors/http.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EndpointsService } from './pages/endpoints/endpoints.service';
import { of, switchMap } from 'rxjs';
import { SharedModule as KnSharedModule } from './_metronic/shared/shared.module';

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise(resolve => {
      authService.checkAdmin().subscribe(() => {
        //@ts-ignore
        authService.getUserInfo().subscribe().add(resolve);
      });
    });
  };
}

@NgModule({
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    SweetAlert2Module.forRoot(),
    KnSharedModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
    EndpointsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
