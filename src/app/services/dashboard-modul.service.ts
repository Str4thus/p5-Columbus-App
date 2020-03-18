import { Injectable } from '@angular/core';
import { Module } from '../components/dashboard-modules/module.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardModulService {
  private moduleList: Module[] = [{
    name:"Drive Module",
    description:"This Module is to Drive the Robot!",
    imageUrl: "https://assets.t3n.sc/news/wp-content/uploads/2018/04/bmw-autonomes-fahren-campus-soeder-1.jpg?auto=format&fit=crop&h=348&ixlib=php-2.3.0&w=620",
    url: "/menu/drive",
  },{
    name:"Camera Module",
    description:"With this Module, you can see the Camera view!",
    imageUrl: "https://cdn.mos.cms.futurecdn.net/dzDWYxpsXBvVtNBd8Cuao8.jpg",
    url: "/menu/camera",
  }
  ,{
    name:"This is an other Module",
    description:"This Module can do some crazy stuff",
    imageUrl:"https://media.pri.org/s3fs-public/styles/story_main/public/images/2019/08/robot_lead_crop.jpg?itok=Uc4umkLW",
    url: "/menu/settings",
  }
]
getModules(){
  return this.moduleList
}
  constructor() { }
}
