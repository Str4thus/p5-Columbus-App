import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Dashboard',
      url: '/menu/dashboard'
    },
    {
      title: 'Einstellungen',
      url: '/menu/settings'
    },
    {
      title: 'Info',
      url: '/menu/info'
    }
  ];
  selectedpath = '';


  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
        this.selectedpath = event.url;
    });
  }

  ngOnInit() {
  }

}
