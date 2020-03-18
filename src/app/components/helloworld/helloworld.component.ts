import { Component, OnInit } from '@angular/core';
import { CameraControllerService } from 'src/app/services/module-controller/camera-controller/camera-controller.service';
import { ModuleDataService } from 'src/app/services/module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';

@Component({
  selector: 'helloworld',
  templateUrl: './helloworld.component.html',
  styleUrls: ['./helloworld.component.scss'],
})
export class HelloworldComponent implements OnInit {

  constructor(private cameraController: CameraControllerService) {
  }
  
  ngOnInit() {}

  d() {
    this.cameraController.disconnect();
  }

  i() {
    console.log(this.cameraController.getStateData("available"));
  }
}
