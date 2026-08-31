import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular/lazy';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';

import { DBConfig, NgxIndexedDBModule } from "ngx-indexed-db";

const dbConfig: DBConfig = {
  name: "www_yangzhen_fr",
  version: 1,
  objectStoresMeta: [
    {
      store: "zhi_hu_author",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [],
    },
    {
      store: "zhi_hu_article",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [],
    },
  ],
};
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
