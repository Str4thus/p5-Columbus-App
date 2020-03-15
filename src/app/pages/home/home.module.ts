import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { HelloworldComponent } from 'src/app/components/helloworld/helloworld.component';
import { ModuleDataService } from 'src/app/services/module-data/module-data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
    ModuleDataService
  ],
  declarations: [HomePage, HelloworldComponent]
})
export class HomePageModule {}
