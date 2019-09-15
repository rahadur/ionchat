import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController} from 'ionic-angular';
import {AvatarComponent} from "../../components/avatar/avatar";
import {User} from "../../model/user";
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage{

  username = '';
  avatar = '001-man.svg';


  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private storage: Storage
  ) {
    this.storage.get('me').then(me => {
      if (me) {
        return this.navCtrl.setRoot('HomePage');
      }
    });
  }

  ionViewWillEnter() {

  }


  login() {

    const me: User = {
      id: '',
      username: this.username,
      avatar: `/assets/svg/avatar/${this.avatar}`,
    };

    this.storage.set('me', me);

    this.navCtrl.setRoot('HomePage', me);
  }

  selectAvatar() {
    let avatarModal = this.modalCtrl.create(AvatarComponent);
    avatarModal.onDidDismiss(data => {
      if (data) {
        this.avatar = data;
      }
    });
    avatarModal.present();
  }
}
