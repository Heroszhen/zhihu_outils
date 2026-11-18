import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular/lazy";

import { VideosPageRoutingModule } from "./videos-routing.module";

import { VideosPage } from "./videos.page";

import { MenuButtonComponent } from "../../shared/menu-button/menu-button.component";
import { VideoPlayerComponent } from "../../shared/video-player/video-player.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideosPageRoutingModule,
    MenuButtonComponent,
    VideoPlayerComponent,
    ReactiveFormsModule,
  ],
  declarations: [VideosPage],
})
export class VideosPageModule {}
