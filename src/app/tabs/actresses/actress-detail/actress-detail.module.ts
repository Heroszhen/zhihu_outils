import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular/lazy";

import { ActressDetailPageRoutingModule } from "./actress-detail-routing.module";

import { ActressDetailPage } from "./actress-detail.page";
import { VideoPlayerComponent } from "../../../shared/video-player/video-player.component";
import { SafePipe } from "../../../pipes/safe.pipe";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ActressDetailPageRoutingModule, VideoPlayerComponent, SafePipe],
  declarations: [ActressDetailPage],
})
export class ActressDetailPageModule {}
