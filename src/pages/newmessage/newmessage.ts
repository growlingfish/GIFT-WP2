import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-newmessage',
  templateUrl: 'newmessage.html',
})
export class NewMessagePage {

  private part: number;
  private message: string = "";
  private buttonAction: string = "Add message";

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
    this.part = navParams.get('part');
  }

  ionViewDidEnter () {
    this.userProvider.getUnfinishedGift().then(gift => {
      if (gift.payloads[this.part].post_content.length > 0) {
        this.message = gift.payloads[this.part].post_content;
        this.buttonAction = "Update message";
      }
    });
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

  addMessage () {
    this.userProvider.getUnfinishedGift().then(gift => {
      gift.payloads[this.part].post_content = this.message;
      this.userProvider.setUnfinishedGift(gift).then(data => {
        this.navCtrl.pop();
      });
    });
  }

  cancel () {
    this.navCtrl.pop();
  }
}
