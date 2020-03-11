import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'helloworld',
  templateUrl: './helloworld.component.html',
  styleUrls: ['./helloworld.component.scss'],
})
export class HelloworldComponent implements OnInit {

  constructor(private dataService: DataService, private socketService: SocketService) { 
    console.log("test");
  }

  ngOnInit() {}
}
