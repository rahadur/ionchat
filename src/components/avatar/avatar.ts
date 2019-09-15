import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";

@Component({
  selector: 'avatar',
  templateUrl: 'avatar.html'
})
export class AvatarComponent {

  avatars = [
    '001-man.svg', '002-girl.svg', '003-boy.svg', '004-woman.svg', '005-man-1.svg',
    '006-woman-1.svg', '007-boy-1.svg', '008-clown.svg', '009-firefighter.svg', '010-girl-1.svg',
    '011-man-2.svg', '012-woman-2.svg', '013-woman-3.svg', '014-man-3.svg', '015-woman-4.svg',
    '016-boy-2.svg', '017-girl-2.svg', '018-boy-3.svg', '019-woman-5.svg', '020-man-4.svg'
  ];

  text: string;

  constructor(
    private viewCtrl: ViewController
  ) {}

  selectAvatar(avatar: string) {
    this.viewCtrl.dismiss(avatar);
  }
}
