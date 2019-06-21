import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', loadChildren: './pages/list/list.module#ListPageModule' },
  { path: 'captured-modal', loadChildren: './pages/captured-modal/captured-modal.module#CapturedModalPageModule' },
  { path: 'image-preview', loadChildren: './pages/image-preview/image-preview.module#ImagePreviewPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
