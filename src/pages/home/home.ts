import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { Socket } from "ng-socket-io";
import {User} from "../../model/user";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  me: User;

  users: User[] = [];

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private socket: Socket
  ) {
    this.socket.connect();
    this.storage.get('me').then((me: User) => {
      if (me) {
        this.me = me;
        this.socket.emit('join', this.me);
      }
    });
  }


  ionViewDidEnter() {
    this.socket.fromEvent('connected').subscribe((me: User) => {
      this.me = me;
      this.storage.set('me', me);
    });
    this.socket.fromEvent('connections').subscribe((res: User[]) => {
      this.users = res;
    });
  }

  ionViewWillUnload() {
    this.socket.removeListener('connected');
    this.socket.removeListener('connections');
    this.socket.disconnect();
  }


  openChat(toUser) {
    const chat = {
      formUser: this.me,
      toUser: toUser
    };
    this.navCtrl.push('ChatPage', chat);
  }


  logout() {
    this.storage.remove('me');
    this.navCtrl.setRoot('LoginPage');
  }
}

