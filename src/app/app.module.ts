import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SocketService } from './services/socket/socket.service';
import { ModuleDataService } from './services/module-data/module-data.service';
import { TestSocket } from 'src/columbus/mocking/TestSocket';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    //{ provide: "MockSocket", useValue: null}, // Comment this out when using the demo
    { provide: "MockSocket", useValue: new TestSocket()}, // For demo; Comment this out when NOT using demo
    StatusBar,
    SplashScreen,
    ModuleDataService,
    SocketService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
