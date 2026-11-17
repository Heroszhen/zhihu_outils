import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ActressesPage } from "./actresses.page";

const routes: Routes = [
  {
    path: "",
    component: ActressesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActressesPageRoutingModule {}
