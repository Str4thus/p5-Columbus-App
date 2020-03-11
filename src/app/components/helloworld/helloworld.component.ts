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

    let event = {t: EventType.ON_MOVE, p: {"data": "1234"}} as IColumbusEvent
    socketService.dispatchEvent(event);
  }

  ngOnInit() {}
}
