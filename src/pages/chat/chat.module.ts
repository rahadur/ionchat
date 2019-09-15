import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ChatPage } from './chat';
import {FileProvider} from "../../providers/file/file";

@NgModule({
  declarations: [
    ChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
  ],
  providers: [
    FileProvider
  ]
})
export class ChatPageModule {}
