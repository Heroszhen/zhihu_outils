import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular/lazy";

import { ZhihuPageRoutingModule } from "./zhihu-routing.module";

import { ZhihuPage } from "./zhihu.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ZhihuPageRoutingModule, ReactiveFormsModule],
  declarations: [ZhihuPage],
})
export class ZhihuPageModule {}
