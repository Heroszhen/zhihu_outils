import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { authGuard } from "../guards/auth-guard";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "zhihu",
        loadChildren: () => import("../components/zhihu/zhihu.module").then((m) => m.ZhihuPageModule),
      },
      {
        path: "videos",
        canActivate: [authGuard],
        loadChildren: () => import("./videos/videos.module").then((m) => m.VideosPageModule),
      },
      {
        path: "photos",
        canActivate: [authGuard],
        loadChildren: () => import("./photos/photos.module").then((m) => m.PhotosPageModule),
      },
      {
        path: "actresses",
        canActivate: [authGuard],
        loadChildren: () => import("./actresses/actresses.module").then((m) => m.ActressesPageModule),
      },
      { path: "", redirectTo: "zhihu", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
