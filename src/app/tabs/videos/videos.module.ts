import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular/lazy";

import { VideosPageRoutingModule } from "./videos-routing.module";

import { VideosPage } from "./videos.page";

import { MenuButtonComponent } from "../../shared/menu-button/menu-button.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, VideosPageRoutingModule, MenuButtonComponent],
  declarations: [VideosPage],
})
export class VideosPageModule {}
