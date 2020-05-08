import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currentUrl: string = '';
  constructor() { }

  ngOnInit() {
  }
  setSocketAdress(){
    //TODO: Set Configurations to new Socket adress 
    //this.currentUrl is the Socket Host
    console.log(this.currentUrl);
  }
}
