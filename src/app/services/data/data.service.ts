import { Injectable } from '@angular/core';
import { SocketConfiguration } from 'src/app/util/SocketConfiguration';
import { IColumbusModule } from 'src/app/models/IColumbusModule';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Subscriptables
  public cameraPort: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public connectedModules: BehaviorSubject<IColumbusModule[]> = new BehaviorSubject<IColumbusModule[]>([]);

  // Sources for Subscriptables
  private conntedModulesSource: IColumbusModule[] = [];
  private cameraPortSource: number = -1;


  //-- General Setters
  public setCameraPort(port: number): void {
    this.cameraPortSource = port;

    this.notifyCameraPortUpdate();
  }
  //----------------------


  //-- Module List Operations
  public addConnectedModule(newModule: IColumbusModule): void {
    this.conntedModulesSource.push(newModule);

    this.notifyModuleUpdate();
  }

  public removeConnectedModule(moduleToRemove: IColumbusModule): void {
    let index = this.conntedModulesSource.indexOf(moduleToRemove);

    if (index > 0) {
      this.conntedModulesSource.splice(index, 1);
    }

    this.notifyModuleUpdate();
  }

  public removeConnectedModuleByIndex(index: number): void {
    this.conntedModulesSource.splice(index, 1);

    this.notifyModuleUpdate();
  }
  //---------------------------

  
  //-- Notify Methods
  private notifyModuleUpdate() {
    this.connectedModules.next(this.conntedModulesSource);
  }

  private notifyCameraPortUpdate() {
    this.cameraPort.next(this.cameraPortSource);
  }
  //------------------------
}
