import { Component, OnInit, Inject } from '@angular/core';
import { CameraControllerService } from 'src/app/services/module-controller/camera-controller/camera-controller.service';
import { TestSocket } from 'src/columbus/mocking/TestSocket';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  cameraImage: string = null; // b64 string
  rotatesLeft: boolean = false;
  rotatesRight: boolean = false;

  moveIntervalHandle = null; // stores the interval that invokes cameraController methods for camera movement

  constructor(private cameraController: CameraControllerService, @Inject("MockSocket") private socket: TestSocket) {
    this.socket.close();
    this.socket.open();
    this.socket.connectCamera();

    this.testImageUpdate();
  }

  ngOnInit() {
  }

  testImageUpdate() {
    this.socket.updateCameraImage();
    this.cameraImage = this.cameraController.getStateData("img");
  }

  leftPress(e) {
    console.log("yeet left");
    if (!this.rotatesRight)
      this.rotatesLeft = true;

    this.moveIntervalHandle = setInterval(() => {
      this.testImageUpdate();
      this.cameraController.rotateHorizontalBy(-2);
    }, 100);
  }

  leftRelease(e) {
    if (this.rotatesLeft) {
      this.rotatesLeft = false;
      clearInterval(this.moveIntervalHandle);
    }
  }

  rightPress(e) {
    console.log("yeet right");
    if (!this.rotatesLeft)
      this.rotatesRight = true;

    this.moveIntervalHandle = setInterval(() => {
      this.testImageUpdate();
      this.cameraController.rotateHorizontalBy(2);
    }, 100);
  }

  rightRelease(e) {
    if (this.rotatesRight) {
      this.rotatesRight = false;
      clearInterval(this.moveIntervalHandle);
    }
  }
}
