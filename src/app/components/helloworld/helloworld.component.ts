import { Component, OnInit } from '@angular/core';
import { CameraControllerService } from 'src/app/services/module-controller/camera-controller/camera-controller.service';

@Component({
  selector: 'helloworld',
  templateUrl: './helloworld.component.html',
  styleUrls: ['./helloworld.component.scss'],
})
export class HelloworldComponent implements OnInit {
  constructor(private cameraController: CameraControllerService) {}
  
  ngOnInit() {}
}
