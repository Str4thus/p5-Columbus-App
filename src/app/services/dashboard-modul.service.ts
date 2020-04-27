import { Injectable } from '@angular/core';
import { Module } from '../components/dashboard-modules/module.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardModulService {
  private moduleList: Module[] = [{
    name: "Steuermodul",
    description: "Mit diesem Modul kann Columbus gesteuert werden!",
    imageUrl: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    url: "/menu/drive",
  }, {
    name: "Kameramodul",
    description: "Mit diesem Modul kann die Kamera gesteuert werden!",
    imageUrl: "https://images.pexels.com/photos/122400/pexels-photo-122400.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    url: "/menu/camera",
  }
    , {
    name: "Platzhaltermodul",
    description: "Dies ist ein Platzhalter",
    imageUrl: "https://images.pexels.com/photos/697662/pexels-photo-697662.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    url: "/menu/settings",
  }
  ]
  getModules() {
    return this.moduleList
  }
}
