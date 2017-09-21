import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { ReviewObjectPage } from '../reviewobject/reviewobject';
import { ReviewMessagePage } from '../reviewmessage/reviewmessage';

@Component({
  selector: 'page-reviewmygift',
  templateUrl: 'reviewmygift.html',
})
export class ReviewMyGiftPage {

  gift: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.gift = navParams.get('gift');
  }

  ionViewCanEnter(): boolean {
    if (this.navParams.get('gift')) {
      return true;
    } else {
      return false;
    }
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

  viewObject (part) {
    this.modalCtrl.create(ReviewObjectPage, { 
      object: this.gift.wraps[part].unwrap_object,
      part: part
    }).present();
  }

  viewMessage (part) {
    this.modalCtrl.create(ReviewMessagePage, {
      message: this.gift.payloads[part].post_content
    }).present();
  }
}
