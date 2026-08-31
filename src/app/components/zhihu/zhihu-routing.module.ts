import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZhihuPage } from './zhihu.page';

const routes: Routes = [
  {
    path: '',
    component: ZhihuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZhihuPageRoutingModule {}
