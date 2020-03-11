import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'helloworld',
  templateUrl: './helloworld.component.html',
  styleUrls: ['./helloworld.component.scss'],
})
export class HelloworldComponent implements OnInit {

  constructor(private dataService: DataService) { 
    console.log("test");
    dataService.initSocket();
    dataService.send("Hi");
  }

  ngOnInit() {}
}
