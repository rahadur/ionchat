import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavParams} from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { Socket } from "ng-socket-io";

import {User} from "../../model/user";
import {Message} from "../../model/message";
import {FileProvider} from "../../providers/file/file";


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  me: User;
  user: User;

  message = '';
  messages: Message[] = [];
  sendingAttachment = false;


  @ViewChild(Content) contentArea: Content;

  constructor(
    public navParams: NavParams,
    private fileChooser: FileChooser,
    private fileProvider: FileProvider,
    private socket: Socket
  ) {
    this.me = this.navParams.data.formUser;
    this.user = this.navParams.data.toUser;
  }

  ionViewDidLoad() {
    this.socket.fromEvent('messageNotify').subscribe((message: Message) => {
      this.messages.push(message);
      this.contentArea.scrollToBottom();
    });
  }

  ionViewWillUnload() {
    this.socket.removeListener('messageNotify');
  }


  async sendAttachment() {

    this.sendingAttachment = true;

    try {
      const selectedFile = await this.fileChooser.open();
      const fileMeta = await this.fileProvider.getFileMetaData(selectedFile);
      const binaryString = await this.fileProvider.getBinaryString();

      const slice  = binaryString.slice(0, 100000);

      this.socket.emit('sendAttachment', {
        from: this.me,
        to: this.user,
        isFile: true,
        message: {
          name: fileMeta.fileName,
          extension: fileMeta.fileExtension,
          size: this.fileProvider.fileSize,
          binary: slice,
        },
        fileUrl: '',
        date: Date.now().toString()
      });

      // Subscribe to requestSlice
      this.socket.fromEvent('requestSlice').subscribe((req: any) => {
        let place = req.currentSlice * 100000,
          slice = binaryString.slice(place, place + Math.min(100000, this.fileProvider.fileSize - place));
        this.socket.emit('sendAttachment', {
          from: this.me,
          to: this.user,
          isFile: true,
          message: {
            name: fileMeta.fileName,
            extension: fileMeta.fileExtension,
            size: this.fileProvider.fileSize,
            binary: slice
          },
          fileUrl: '',
          date: Date.now().toString()
        });
      });
      this.socket.fromEvent('sendAttachmentComplete').subscribe((message:Message) => {
        this.messages.push(message);
        this.contentArea.scrollToBottom();
        this.socket.removeListener('requestSlice');
        this.socket.removeListener('sendAttachmentComplete');
        this.sendingAttachment = false;

      });

    } catch (e) {
      console.error(e);
      this.sendingAttachment = false;
    }

  }

  // On Send Button Click
  // Send message to a user after
  sendMessage() {
    const message = {
      from: this.me,
      to: this.user,
      isFile: false,
      message: this.message,
      date: Date.now().toString()
    };
    this.socket.emit('message', message);
    this.message = '';
    this.messages.push(message);
    this.contentArea.scrollToBottom();
  }
}
