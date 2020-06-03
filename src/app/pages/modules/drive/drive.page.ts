import { Component, OnInit, Inject } from '@angular/core';
import { EngineControllerService } from 'src/app/services/module-controller/engine-controller/engine-controller.service';
import { TestSocket } from 'src/columbus/mocking/TestSocket';
import { CameraControllerService } from 'src/app/services/module-controller/camera-controller/camera-controller.service';
import { SocketService } from 'src/app/services/socket/socket.service';


@Component({
  selector: 'app-drive',
  templateUrl: './drive.page.html',
  styleUrls: ['./drive.page.scss'],
})
export class DrivePage implements OnInit {
  movement: [number, number, number, number] = [0, 0, 0, 0] // forward, right, backward, left; from 0 to 1
  cameraImage = null;

  constructor(private engineController: EngineControllerService, private cameraController: CameraControllerService, private socket: SocketService) {
    this.testImageUpdate();
  }

  ngOnInit() {
  }

  testImageUpdate() {  
    this.cameraImage = this.cameraController.getStateData("img");
  }

  // Forward
  forwardPress(e) {
    this.movement[0] = 1;
    this.engineController.applyMovement(this.movement);
  }
  forwardRelease(e) {
    this.movement[0] = 0;
    this.engineController.applyMovement(this.movement);
  }

  // Right
  rightPress(e) {
    this.movement[1] = 1;
    this.engineController.applyMovement(this.movement);
  }
  rightRelease(e) {
    this.movement[1] = 1;
    this.engineController.applyMovement(this.movement);
  }

  // Backward
  backwardPress(e) {
    this.movement[2] = 1;
    this.engineController.applyMovement(this.movement);
  }
  backwardRelease(e) {
    this.movement[2] = 0;
    this.engineController.applyMovement(this.movement);
  }

  // Left
  leftPress(e) {
    this.movement[3] = 1;
    this.engineController.applyMovement(this.movement);
  }
  leftRelease(e) {
    this.movement[3] = 0;
    this.engineController.applyMovement(this.movement);
  }
}
