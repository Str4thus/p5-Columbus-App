import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule),
      },
      {
        path: 'camera',
        loadChildren: () => import('../modules/camera/camera.module').then( m => m.CameraPageModule) 
      },
      {
        path: 'drive',
        loadChildren: () => import('../modules/drive/drive.module').then( m => m.DrivePageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/menu/dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
