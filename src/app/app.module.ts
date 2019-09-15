import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {File} from "@ionic-native/file";
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { MyApp } from './app.component';
import {ComponentsModule} from "../components/components.module";
import {IonicStorageModule} from "@ionic/storage";
import { FileProvider } from '../providers/file/file';

const ioConfig: SocketIoConfig = { url: 'http://192.168.31.197:3000', options: {} };


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__ionchat',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    SocketIoModule.forRoot(ioConfig),
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    FileChooser,
    FilePath,
    FileProvider
  ]
})
export class AppModule {}
