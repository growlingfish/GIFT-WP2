import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

@Component({
  selector: 'page-reviewgift',
  templateUrl: 'reviewgift.html',
})
export class ReviewGiftPage {

  gift: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

}
