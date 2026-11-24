import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular/lazy";

import { ActressDetailPageRoutingModule } from "./actress-detail-routing.module";

import { ActressDetailPage } from "./actress-detail.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ActressDetailPageRoutingModule],
  declarations: [ActressDetailPage],
})
export class ActressDetailPageModule {}
