import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ActressesPage } from "./actresses.page";

const routes: Routes = [
  {
    path: "",
    component: ActressesPage,
  },
  {
    path: "detail/:id",
    loadChildren: () => import("./actress-detail/actress-detail.module").then((m) => m.ActressDetailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActressesPageRoutingModule {}
