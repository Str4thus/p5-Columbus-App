import { TestBed } from '@angular/core/testing';

import { DashboardModulService } from './dashboard-modul.service';

describe('DashboardModulService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardModulService = TestBed.get(DashboardModulService);
    expect(service).toBeTruthy();
  });
});
