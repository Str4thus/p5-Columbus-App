import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'helloworld',
  templateUrl: './helloworld.component.html',
  styleUrls: ['./helloworld.component.scss'],
})
export class HelloworldComponent implements OnInit {
  constructor() { }
  
  ngOnInit() {}
}
