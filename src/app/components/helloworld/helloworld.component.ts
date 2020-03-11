import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { IColumbusEvent } from 'src/app/models/IColumbusCommand';
import { EventType } from 'src/app/util/Enums';

@Component({
  selector: 'helloworld',
  templateUrl: './helloworld.component.html',
  styleUrls: ['./helloworld.component.scss'],
})
export class HelloworldComponent implements OnInit {

  constructor(private dataService: DataService, private socketService: SocketService) { 
    console.log("test");


    //-- Event Dispatching Test
    // let eventPayload = {"data": "1234"}
    // let event = {t: EventType.ON_MOVE, p: eventPayload} as IColumbusEvent
    // socketService.dispatchEvent(event);

    //-- Data Service Test
    dataService.connectedModules.subscribe(n => console.log(n));

    // dataService.addConnectedModule({name: "hi1"})
    // console.log(dataService.connectedModules.value);
    // dataService.addConnectedModule({name: "hi2"})
    // console.log(dataService.connectedModules.value);
    // dataService.addConnectedModule({name: "hi3"})
    // console.log(dataService.connectedModules.value);

    // dataService.removeConnectedModuleByIndex(0);
    
    // console.log(dataService.connectedModules.value);
  }

  ngOnInit() {}
}
