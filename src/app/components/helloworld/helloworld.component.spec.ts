import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelloworldComponent } from './helloworld.component';

xdescribe('HelloworldComponent', () => {
  let component: HelloworldComponent;
  let fixture: ComponentFixture<HelloworldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelloworldComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelloworldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
