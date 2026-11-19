import { NgModule, importProvidersFrom, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular/lazy";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { DBConfig, NgxIndexedDBModule } from "ngx-indexed-db";
import { ServiceWorkerModule } from "@angular/service-worker";
import { errorInterceptor } from "./interceptors/error.interceptor";
import { LoaderComponent } from "./shared/loader/loader.component";

const dbConfig: DBConfig = {
  name: "www_yangzhen_fr",
  version: 2,
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
    {
      store: "actress_video",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [],
    },
  ],
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
    LoaderComponent,
  ],
  providers: [
    provideHttpClient(withInterceptors([errorInterceptor])),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
