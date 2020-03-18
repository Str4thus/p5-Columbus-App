import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { DashboardModulesComponent } from '../../components/dashboard-modules/dashboard-modules.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule
  ],
  declarations: [DashboardPage, DashboardModulesComponent]
})
export class DashboardPageModule {}
