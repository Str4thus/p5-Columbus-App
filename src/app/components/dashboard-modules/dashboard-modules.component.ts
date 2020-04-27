import { Component, OnInit } from '@angular/core';
import { Module } from './module.model';
import { DashboardModulService } from 'src/app/services/dashboard-modul.service';

@Component({
  selector: 'app-dashboard-modules',
  templateUrl: './dashboard-modules.component.html',
  styleUrls: ['./dashboard-modules.component.scss'],
})
export class DashboardModulesComponent implements OnInit {
  modules: Module[];
  constructor(private dashboardModules: DashboardModulService) { }

  ngOnInit() {
    this.modules = this.dashboardModules.getModules();
  }

}
