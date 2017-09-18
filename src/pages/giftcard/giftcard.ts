import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-giftcard',
  templateUrl: 'giftcard.html',
})
export class GiftcardPage {

  private message: string = "";
  private buttonAction: string = "Add message";

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
  }

  ionViewDidEnter () {
    this.userProvider.getUnfinishedGift().then(gift => {
      if (gift.giftcards[0].post_content.length > 0) {
        this.message = gift.giftcards[0].post_content;
        this.buttonAction = "Update message";
      }
    });
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

  addMessage () {
    this.userProvider.getUnfinishedGift().then(gift => {
      gift.giftcards[0].post_content = this.message;
      this.userProvider.setUnfinishedGift(gift).then(data => {
        this.navCtrl.pop();
      });
    });
  }

  cancel () {
    this.navCtrl.pop();
  }
}
