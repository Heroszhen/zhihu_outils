import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'folder',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:folder',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./components/zhihu/zhihu.module').then( m => m.ZhihuPageModule)
  },
  {
    path: 'zhihu',
    loadChildren: () => import('./components/zhihu/zhihu.module').then( m => m.ZhihuPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, bindToComponentInputs: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
