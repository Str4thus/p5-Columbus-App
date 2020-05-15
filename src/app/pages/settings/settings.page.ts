import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket/socket.service';
import { SocketConfiguration } from 'src/columbus/data-models/socket/SocketConfiguration';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currentUrl: string = '';

  constructor(private socketService: SocketService) { }

  ngOnInit() {
  }
  setSocketAdress(){
    let [host, port] = this.currentUrl.split(":");
    let config = new SocketConfiguration(host, port);
    this.socketService.reinit(config);
  }
}
