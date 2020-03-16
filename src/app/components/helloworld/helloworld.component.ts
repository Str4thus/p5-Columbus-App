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
  constructor(private cameraController: CameraControllerService, private f: ModuleDataService) {
    this.cameraController.rotateVertically(40);
  }
  
  ngOnInit() {
    // Simulate delayed connection of module
    let x = setInterval(() => {
      this.f.addModule(new ColumbusModule(ColumbusModuleType.CAMERA));
      this.cameraController.rotateVertically(40);
      this.cameraController.rotateVertically(40);
      console.log("added");
      clearInterval(x);
    }, 2500);
  }
}
