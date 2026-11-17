import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular/lazy";

import { ActressesPageRoutingModule } from "./actresses-routing.module";

import { ActressesPage } from "./actresses.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ActressesPageRoutingModule],
  declarations: [ActressesPage],
})
export class ActressesPageModule {}
