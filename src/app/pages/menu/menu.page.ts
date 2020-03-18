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
      title: 'Dashboard Page',
      url: '/menu/dashboard'
    },
    {
      title: 'Settings Page',
      url: '/menu/settings'
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
