import { Injectable } from '@angular/core';
import { Module } from '../components/dashboard-modules/module.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardModulService {
  private moduleList: Module[] = [{
    name:"Drive Module",
    description:"This Module is to Drive the Robot!",
    imageUrl: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    url: "/menu/drive",
  },{
    name:"Camera Module",
    description:"With this Module, you can see the Camera view!",
    imageUrl: "https://images.pexels.com/photos/122400/pexels-photo-122400.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    url: "/menu/camera",
  }
  ,{
    name:"This is an other Module",
    description:"This Module can do some crazy stuff",
    imageUrl:"https://images.pexels.com/photos/697662/pexels-photo-697662.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    url: "/menu/settings",
  }
]
getModules(){
  return this.moduleList
}
  constructor() { }
}
