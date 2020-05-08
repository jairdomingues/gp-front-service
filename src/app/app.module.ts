import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig } from '@angular/material/core';
import { 
  PerfectScrollbarModule, 
  PERFECT_SCROLLBAR_CONFIG, 
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';

import { rootRouterConfig } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// import { AngularFireModule } from '@angular/fire';
// import { AngularFireDatabaseModule } from '@angular/fire/database';
import {CookieModule} from 'ngx-cookie';
// import { AngularFirestore } from '@angular/fire/firestore/firestore';

import {AngularFirestoreModule, AngularFirestore, FirestoreSettingsToken} from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { MessagingService } from './_services/messaging.service';
import { AngularFireMessaging, AngularFireMessagingModule } from '@angular/fire/messaging';

import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({ 
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'angularexampleapp'),
    CurrencyMaskModule,
    AngularFirestoreModule,
    AngularFireMessagingModule,
    CookieModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    PerfectScrollbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true}),
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [AppComponent],
  providers: [ authInterceptorProviders, MessagingService, 
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor(private db: AngularFirestore) {

    this.db.firestore.settings({
      cacheSizeBytes: -1 //db.firestore.CACHE_SIZE_UNLIMITED
    });

    this.db.firestore.enablePersistence()
      .catch(function(err) {
          if (err.code == 'failed-precondition') {
              // Multiple tabs open, persistence can only be enabled
              // in one tab at a a time.
              // ...
          } else if (err.code == 'unimplemented') {
              // The current browser does not support all of the
              // features required to enable persistence
              // ...
          }
      })
  }


}