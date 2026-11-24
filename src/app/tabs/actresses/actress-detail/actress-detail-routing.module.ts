import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ActressDetailPage } from "./actress-detail.page";

const routes: Routes = [
  {
    path: "",
    component: ActressDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActressDetailPageRoutingModule {}
