import { Component, OnInit, Inject } from '@angular/core';
import { CameraControllerService } from 'src/app/services/module-controller/camera-controller/camera-controller.service';
import { TestSocket } from 'src/columbus/mocking/TestSocket';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  cameraImage: string = null; // b64 string
  rotatesLeft: boolean = false;
  rotatesRight: boolean = false;
  rotatesUp: boolean = false;
  rotatesDown: boolean = false;

  moveIntervalHandle = null; // stores the interval that invokes cameraController methods for camera movement

  constructor(private cameraController: CameraControllerService, private socket: SocketService) {
    this.testImageUpdate();
  }

  ngOnInit() {
  }

  testImageUpdate() {
    this.cameraImage = this.cameraController.getStateData("img");
  }

  upPress(e) {
    if (!this.rotatesDown)
      this.rotatesUp = true;

    this.moveIntervalHandle = setInterval(() => {
      this.cameraController.rotateVerticalBy(-2);
    }, 100);
  }

  upRelease(e) {
    if (this.rotatesUp) {
      this.rotatesUp = false;
      clearInterval(this.moveIntervalHandle);
    }
  }

  downPress(e) {
    if (!this.rotatesUp)
      this.rotatesDown = true;

    this.moveIntervalHandle = setInterval(() => {
      this.cameraController.rotateVerticalBy(2);
    }, 100);
  }

  downRelease(e) {
    if (this.rotatesDown) {
      this.rotatesDown = false;
      clearInterval(this.moveIntervalHandle);
    }
  }

  leftPress(e) {
    if (!this.rotatesRight)
      this.rotatesLeft = true;

    this.moveIntervalHandle = setInterval(() => {
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
    if (!this.rotatesLeft)
      this.rotatesRight = true;

    this.moveIntervalHandle = setInterval(() => {
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
