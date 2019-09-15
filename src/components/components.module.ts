import { NgModule } from '@angular/core';
import { AvatarComponent } from './avatar/avatar';
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [
    AvatarComponent
  ],
  entryComponents: [
    AvatarComponent
  ],
	imports: [IonicModule],
	exports: [
    AvatarComponent
  ]
})
export class ComponentsModule {}
